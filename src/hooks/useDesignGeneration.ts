import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  DesignGenerationError,
  DesignGenerationErrorCode,
  DesignGenerationInput,
  DesignGenerationResult,
  DesignGenerationSuccess,
} from "@/types/ai";

interface FunctionErrorContext {
  status?: number;
  clone?: () => FunctionErrorContext;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
}

interface FunctionInvokeErrorLike {
  message?: string;
  context?: FunctionErrorContext;
}

type RawGenerationPayload = {
  ok?: boolean;
  requestId?: string;
  imageUrl?: string;
  description?: string;
  remaining?: number;
  degraded?: boolean;
  code?: DesignGenerationErrorCode;
  error?: string;
  retryable?: boolean;
  retryAfterSeconds?: number;
  limitReached?: boolean;
  needClearerPhoto?: boolean;
  reason?: string;
};

const CLIENT_MAX_ATTEMPTS = 2;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildClientRequestId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const parseFunctionErrorPayload = async (invokeError: unknown) => {
  const typedError = invokeError as FunctionInvokeErrorLike;

  try {
    if (typedError.context && typeof typedError.context.json === "function") {
      const clone = typeof typedError.context.clone === "function" ? typedError.context.clone() : typedError.context;
      return await clone.json!();
    }
  } catch {
    // Ignore parse errors and continue fallback parsing.
  }

  try {
    if (typedError.context && typeof typedError.context.text === "function") {
      const clone = typeof typedError.context.clone === "function" ? typedError.context.clone() : typedError.context;
      const raw = await clone.text!();
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return { error: raw };
      }
    }
  } catch {
    // Ignore parse errors and continue fallback parsing.
  }

  if (typeof typedError.message === "string") {
    try {
      return JSON.parse(typedError.message);
    } catch {
      return null;
    }
  }

  return null;
};

const deriveFallbackCode = (status: number | undefined, payload: RawGenerationPayload): DesignGenerationErrorCode => {
  if (payload.limitReached) return "LIMIT_REACHED";
  if (payload.needClearerPhoto) return "IMAGE_UNCLEAR";

  if (status === 429) return payload.limitReached ? "LIMIT_REACHED" : "BUSY";
  if (status === 400 || status === 413 || status === 415) return "INVALID_INPUT";
  if (status === 422) return "UPSTREAM_BLOCKED";
  if (status === 500) return "CONFIG_ERROR";
  if (status === 502 || status === 503 || status === 504) return "BUSY";

  return "UNKNOWN";
};

const buildNormalizedError = ({
  requestId,
  payload,
  status,
  fallbackMessage,
}: {
  requestId: string;
  payload: RawGenerationPayload;
  status?: number;
  fallbackMessage?: string;
}): DesignGenerationError => {
  const code = (payload.code as DesignGenerationErrorCode | undefined) || deriveFallbackCode(status, payload);
  const errorMessage =
    (typeof payload.error === "string" && payload.error.trim()) ||
    fallbackMessage ||
    "Failed to generate design. Please try again.";

  const retryable =
    typeof payload.retryable === "boolean"
      ? payload.retryable
      : code === "BUSY" || code === "IMAGE_UNCLEAR";

  const retryAfterSeconds =
    typeof payload.retryAfterSeconds === "number" && Number.isFinite(payload.retryAfterSeconds)
      ? payload.retryAfterSeconds
      : undefined;

  const resolvedRequestId =
    (typeof payload.requestId === "string" && payload.requestId.trim()) || requestId;

  return {
    ok: false,
    requestId: resolvedRequestId,
    code,
    error: errorMessage,
    retryable,
    retryAfterSeconds,
    remaining: typeof payload.remaining === "number" ? payload.remaining : undefined,
    limitReached: Boolean(payload.limitReached),
    needClearerPhoto: Boolean(payload.needClearerPhoto),
    reason: typeof payload.reason === "string" ? payload.reason : undefined,
  };
};

const buildRetryDelay = (retryAfterSeconds?: number) => {
  if (!retryAfterSeconds || retryAfterSeconds <= 0) return 1600;
  if (retryAfterSeconds <= 5) return retryAfterSeconds * 1000;
  return 2500;
};

const normalizeSuccess = (requestId: string, payload: RawGenerationPayload): DesignGenerationResult => {
  if (payload.ok === false) {
    return buildNormalizedError({ requestId, payload, fallbackMessage: payload.error });
  }

  if (typeof payload.imageUrl !== "string" || !payload.imageUrl.trim()) {
    return buildNormalizedError({
      requestId,
      payload,
      fallbackMessage: "No image was returned. Please try again.",
    });
  }

  return {
    ok: true,
    requestId: typeof payload.requestId === "string" && payload.requestId.trim() ? payload.requestId : requestId,
    imageUrl: payload.imageUrl,
    description: typeof payload.description === "string" ? payload.description : "",
    remaining: typeof payload.remaining === "number" ? payload.remaining : undefined,
    degraded: Boolean(payload.degraded),
  };
};

const shouldRetryClientSide = (result: DesignGenerationError, attempt: number) => {
  if (attempt >= CLIENT_MAX_ATTEMPTS) return false;
  if (result.limitReached) return false;
  return result.code === "BUSY" && result.retryable;
};

export function useDesignGeneration() {
  const generateDesign = useCallback(async (input: DesignGenerationInput): Promise<DesignGenerationResult> => {
    const clientRequestId = buildClientRequestId();

    for (let attempt = 1; attempt <= CLIENT_MAX_ATTEMPTS; attempt += 1) {
      const invokeResult = await supabase.functions.invoke<RawGenerationPayload>("generate-design", {
        body: {
          imageBase64: input.imageBase64,
          prompt: input.prompt,
          spaceType: input.spaceType,
          imageWidth: input.imageWidth,
          imageHeight: input.imageHeight,
          clientRequestId,
        },
      });

      if (!invokeResult.error) {
        const normalized = normalizeSuccess(clientRequestId, invokeResult.data ?? {});
        if (!normalized.ok && shouldRetryClientSide(normalized, attempt)) {
          await wait(buildRetryDelay(normalized.retryAfterSeconds));
          continue;
        }
        return normalized;
      }

      const payload = (await parseFunctionErrorPayload(invokeResult.error)) as RawGenerationPayload | null;
      const status = (invokeResult.error as FunctionInvokeErrorLike | null)?.context?.status;

      const normalizedError = buildNormalizedError({
        requestId: clientRequestId,
        payload: payload ?? {},
        status,
        fallbackMessage: invokeResult.error.message,
      });

      if (shouldRetryClientSide(normalizedError, attempt)) {
        await wait(buildRetryDelay(normalizedError.retryAfterSeconds));
        continue;
      }

      return normalizedError;
    }

    return {
      ok: false,
      requestId: clientRequestId,
      code: "BUSY",
      error: "AI service is temporarily unavailable. Please try again shortly.",
      retryable: true,
      retryAfterSeconds: 60,
    };
  }, []);

  return {
    generateDesign,
  };
}
