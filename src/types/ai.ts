export type DesignGenerationErrorCode =
  | "BUSY"
  | "LIMIT_REACHED"
  | "INVALID_INPUT"
  | "IMAGE_UNCLEAR"
  | "UPSTREAM_BLOCKED"
  | "CONFIG_ERROR"
  | "UNKNOWN";

export type DesignGenerationSpaceType = "bathroom" | "kitchen" | "laundry" | "open-plan";

export type DesignGenerationInput = {
  imageBase64: string;
  prompt: string;
  spaceType: DesignGenerationSpaceType;
  imageWidth?: number;
  imageHeight?: number;
};

export type DesignGenerationSuccess = {
  ok: true;
  requestId: string;
  imageUrl: string;
  description: string;
  remaining?: number;
  degraded?: boolean;
};

export type DesignGenerationError = {
  ok: false;
  requestId: string;
  code: DesignGenerationErrorCode;
  error: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  remaining?: number;
  limitReached?: boolean;
  needClearerPhoto?: boolean;
  reason?: string;
};

export type DesignGenerationResult = DesignGenerationSuccess | DesignGenerationError;
