import { Component, Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Sparkles, Loader2, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import { cn } from "@/lib/utils";
import { useResolvedAsset } from "@/hooks/useSiteAssets";
import SEO from "@/components/SEO";

const ChatMessage = ({
  role,
  children,
  className,
  avatarSrc,
}: {
  role: "assistant" | "user";
  children: ReactNode;
  className?: string;
  avatarSrc?: string | null;
}) => (
  <div
    className={cn(
      "flex w-full gap-3",
      role === "user" ? "justify-end" : "justify-start"
    )}
  >
    {role === "assistant" && (
      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden border border-border">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <span className="text-[11px] font-semibold">CDC</span>
        )}
      </div>
    )}
    <div
      className={cn(
        "max-w-[78%] text-sm leading-relaxed",
        role === "user"
          ? "bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-sm"
          : "bg-muted/40 border border-border/60 text-foreground rounded-2xl px-4 py-3",
        className
      )}
    >
      {children}
    </div>
  </div>
);

const ChoiceButton = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={cn(
      "px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all border",
      selected
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background text-foreground/70 border-border hover:text-foreground hover:border-primary/40"
    )}
  >
    {children}
  </button>
);

const OptionGroup = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}) => (
  <div className="space-y-2">
    <p className="text-xs text-foreground/60">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <ChoiceButton
          key={option}
          selected={value === option}
          onClick={() => onChange(value === option ? null : option)}
        >
          {option}
        </ChoiceButton>
      ))}
    </div>
  </div>
);

const HistoryPreview = ({
  beforeImage,
  afterImage,
}: {
  beforeImage: string;
  afterImage: string;
}) => {
  const [mode, setMode] = useState<"compare" | "result">("compare");

  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 bg-background">
      <div className="flex gap-1 p-2 bg-muted/30 border-b border-border">
        <button
          onClick={() => setMode("compare")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm transition-all",
            mode === "compare" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
          )}
        >
          Compare
        </button>
        <button
          onClick={() => setMode("result")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm transition-all",
            mode === "result" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
          )}
        >
          Result
        </button>
      </div>
      <div className="p-5">
        {mode === "compare" ? (
          <ImageComparisonSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="Before"
            afterLabel="After"
          />
        ) : (
          <img src={afterImage} alt="AI-generated renovation result" className="w-full h-auto rounded-lg" />
        )}
      </div>
      <div className="px-5 pb-5">
        <a
          href={afterImage}
          download="ai-renovation-preview.jpg"
          className="inline-flex items-center justify-center w-full h-11 rounded-lg border border-primary text-primary font-medium text-sm tracking-[0.15em] uppercase hover:bg-primary/10 transition"
        >
          Download Image
        </a>
      </div>
    </div>
  );
};

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Preview render failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full border border-border rounded-2xl bg-background p-6 text-sm text-foreground/70">
          Preview failed to render. Please try generating again.
        </div>
      );
    }
    return this.props.children;
  }
}

// Space Types
type SpaceType = "bathroom" | "kitchen" | "laundry" | "open-plan" | null;

type PreferenceField = {
  key: string;
  label: string;
  options: string[];
};

type InputMode = "options" | "describe" | null;

type HistoryEntry = {
  id: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  userNote: string | null;
  spaceType: SpaceType;
  inputMode: InputMode;
  detailSelections: Record<string, string>;
  customPrompt: string;
};

type PostGenerationAction = "make_changes" | "generate_more" | null;

type LayoutFailureReason =
  | "structural_edges_changed"
  | "camera_or_geometry_shifted"
  | "fixtures_or_openings_moved"
  | "room_boundaries_expanded_or_compressed";

interface FunctionErrorContext {
  clone?: () => Response;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
}

interface FunctionInvokeErrorLike {
  message?: string;
  context?: FunctionErrorContext;
}

const SPACE_TYPES = [
  { value: "bathroom", label: "Bathroom", icon: "🛁" },
  { value: "kitchen", label: "Kitchen", icon: "🍳" },
  { value: "laundry", label: "Laundry", icon: "🧺" },
  { value: "open-plan", label: "Living / Open Plan", icon: "🏠" },
];

const SPACE_PREFERENCE_FIELDS: Record<Exclude<SpaceType, null>, PreferenceField[]> = {
  bathroom: [
    { key: "floorTiles", label: "Floor tiles", options: ["Light porcelain", "Warm beige", "Marble look", "Terrazzo", "Dark slate"] },
    { key: "wallTiles", label: "Wall tiles", options: ["White subway", "Vertical tiles", "Large format", "Textured stone", "Soft beige"] },
    { key: "plumbingFittings", label: "Plumbing fittings", options: ["Chrome", "Matte black", "Brushed nickel", "Brass"] },
    { key: "vanityCabinet", label: "Vanity cabinet", options: ["White", "Warm timber", "Soft grey", "Deep green"] },
    { key: "vanityBenchTile", label: "Vanity bench tile", options: ["White stone", "Warm stone", "Concrete look", "Timber look"] },
  ],
  kitchen: [
    { key: "flooring", label: "Flooring", options: ["Light oak", "Mid oak", "Polished concrete", "Large tiles"] },
    { key: "tiles", label: "Tiles", options: ["White subway", "Vertical tiles", "Pattern tiles", "Stone slab"] },
    { key: "floorBoards", label: "Floor boards", options: ["Wide oak", "Natural timber", "Smoked timber"] },
    { key: "cabinetColor", label: "Cabinet color", options: ["White", "Soft grey", "Warm timber", "Sage green", "Charcoal"] },
    { key: "benchtopColor", label: "Benchtop color", options: ["White stone", "Warm stone", "Concrete grey", "Dark stone"] },
    { key: "splashbackTiles", label: "Splashback tiles", options: ["White subway", "Vertical tiles", "Stone slab", "Soft pattern"] },
    { key: "plumbingFittings", label: "Plumbing fittings", options: ["Chrome", "Matte black", "Brushed nickel", "Brass"] },
    { key: "handles", label: "Handles", options: ["Brushed brass", "Matte black", "Stainless", "No handles"] },
  ],
  laundry: [
    { key: "floorTiles", label: "Floor tiles", options: ["Light porcelain", "Grey tile", "Terrazzo", "Concrete look"] },
    { key: "cabinetColor", label: "Cabinet color", options: ["White", "Soft grey", "Warm timber", "Sage green"] },
    { key: "benchtopColor", label: "Benchtop color", options: ["White stone", "Warm stone", "Concrete grey"] },
    { key: "splashbackTiles", label: "Splashback tiles", options: ["White subway", "Vertical tiles", "Soft pattern"] },
    { key: "plumbingFittings", label: "Plumbing fittings", options: ["Chrome", "Matte black", "Brushed nickel", "Brass"] },
    { key: "handles", label: "Handles", options: ["Brushed brass", "Matte black", "Stainless", "No handles"] },
  ],
  "open-plan": [
    { key: "flooring", label: "Flooring", options: ["Light oak", "Mid oak", "Polished concrete", "Large tiles"] },
    { key: "wallColor", label: "Wall color", options: ["Warm white", "Soft greige", "Light beige", "Soft grey"] },
  ],
};
 
const buildPreferenceSentence = (
  spaceType: SpaceType,
  details: Record<string, string>
): string => {
  if (!spaceType) return "";

  const spaceLabel = spaceType.replace("-", " ");
  const parts: string[] = [];
  const preferenceLines: string[] = [];

  const fields = SPACE_PREFERENCE_FIELDS[spaceType] || [];
  fields.forEach((field) => {
    const value = details[field.key]?.trim();
    if (value) {
      preferenceLines.push(`${field.label}: ${value}.`);
    }
  });

  parts.push(`Update this ${spaceLabel} with refreshed finishes and styling.`);
  if (preferenceLines.length > 0) {
    parts.push(`Preferences: ${preferenceLines.join(" ")}`);
  } else {
    parts.push("Choose a clean, balanced palette with modern, timeless finishes.");
  }
  parts.push("Keep the same layout. Change surface materials only.");

  return parts.join(" ");
};
  const AIDesignGenerator = () => {
  const navigate = useNavigate();
  const logoSrc = useResolvedAsset("logo");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; isPortrait: boolean } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"compare" | "result">("compare");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [spaceType, setSpaceType] = useState<SpaceType>(null);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [detailSelections, setDetailSelections] = useState<Record<string, string>>({});
  const [customPrompt, setCustomPrompt] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [showChatInput, setShowChatInput] = useState(false);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState("");
  const [pendingUserNote, setPendingUserNote] = useState<string | null>(null);
  const [isNewImageFlow, setIsNewImageFlow] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generationHistory, setGenerationHistory] = useState<HistoryEntry[]>([]);
  const [generationGuardrailMessage, setGenerationGuardrailMessage] = useState<string | null>(null);
  const [leadGateOpen, setLeadGateOpen] = useState(false);
  const [leadGateStep, setLeadGateStep] = useState<1 | 2>(1);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [pendingAction, setPendingAction] = useState<PostGenerationAction>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const MAX_SESSION_GENERATIONS = 4;
  const [leadForm, setLeadForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    timeline: "",
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const finalPrompt = useMemo(() => {
    if (!spaceType) return "";
    if (inputMode === "describe") {
      const trimmed = customPrompt.trim();
      if (!trimmed) return "";
      const spaceLabel = spaceType.replace("-", " ");
      return `Space type: ${spaceLabel}. ${trimmed}`;
    }
    if (inputMode === "options") {
      return buildPreferenceSentence(spaceType, detailSelections);
    }
    return "";
  }, [spaceType, inputMode, customPrompt, detailSelections]);

  const hasQuickSelections = useMemo(
    () => Object.values(detailSelections).some((value) => value && value.trim().length > 0),
    [detailSelections]
  );
  const hasTypedPrompt = customPrompt.trim().length > 0;
  const readyToGenerate =
    !!spaceType &&
    ((inputMode === "options" && hasQuickSelections) || (inputMode === "describe" && hasTypedPrompt));
  const hasGenerated = generationHistory.length > 0;
  const isInitialGeneration = isGenerating && (!hasGenerated || isNewImageFlow);
  const isUpdateGeneration = isGenerating && hasGenerated && !isNewImageFlow;
  const hasPendingUpdate = hasGenerated && !!finalPrompt && finalPrompt !== lastGeneratedPrompt && !isNewImageFlow;

  const buildSelectionsSummary = (type: SpaceType, selections: Record<string, string>) => {
    if (!type) return "";
    const fields = SPACE_PREFERENCE_FIELDS[type] || [];
    const parts = fields
      .map((field) => (selections[field.key] ? `${field.label}: ${selections[field.key]}` : ""))
      .filter(Boolean);
    return parts.join(" · ");
  };

  const getSpaceLabel = (type: SpaceType) =>
    type ? SPACE_TYPES.find((space) => space.value === type)?.label ?? "" : "";

  const loadingMessages = [
    "Magic happening…",
    "Something’s cooking…",
    "Polishing the finishes…",
    "Shaping the details…",
    "Almost there…",
  ];

  const renderHistoryContext = (item: HistoryEntry, index: number) => {
    const previous = generationHistory[index - 1];
    const isNewImageSession = !previous || previous.beforeImage !== item.beforeImage;
    const spaceLabel = getSpaceLabel(item.spaceType);
    const selectionSummary =
      item.inputMode === "options" ? buildSelectionsSummary(item.spaceType, item.detailSelections) : "";
    const typedPrompt =
      item.inputMode === "describe" ? (item.userNote ?? item.customPrompt).trim() : item.userNote ?? "";

    return (
      <>
        {isNewImageSession && (
          <ChatMessage role="user">
            <div className="space-y-3">
              <p>Uploaded a photo.</p>
              <img
                src={item.beforeImage}
                alt="Uploaded room photo for renovation preview"
                className="w-full max-w-[260px] sm:max-w-[320px] rounded-xl border border-border"
              />
            </div>
          </ChatMessage>
        )}

        {isNewImageSession && spaceLabel && <ChatMessage role="user">{spaceLabel}</ChatMessage>}

        {isNewImageSession && item.inputMode && (
          <ChatMessage role="user">
            {item.inputMode === "options" ? "Quick options" : "Type what you want"}
          </ChatMessage>
        )}

        {isNewImageSession && item.inputMode === "options" && selectionSummary && (
          <ChatMessage role="user">{selectionSummary}</ChatMessage>
        )}

        {isNewImageSession && item.inputMode === "describe" && typedPrompt && (
          <ChatMessage role="user">{typedPrompt}</ChatMessage>
        )}

        {!isNewImageSession && typedPrompt && <ChatMessage role="user">{typedPrompt}</ChatMessage>}
      </>
    );
  };

  useEffect(() => {
    if (!chatBottomRef.current) return;
    chatBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    uploadedImage,
    spaceType,
    inputMode,
    hasTypedPrompt,
    isGenerating,
    generationHistory.length,
    showChatInput,
    pendingUserNote,
    isNewImageFlow,
  ]);

  useEffect(() => {
    if (!isGenerating) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlocked = window.localStorage.getItem("aiRenovationLeadUnlocked") === "true";
    setLeadCaptured(unlocked);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenIntro = sessionStorage.getItem("aiGeneratorIntroSeen") === "true";
    if (!hasSeenIntro) {
      navigate("/design-tools/ai-generator/intro", { replace: true });
    }
  }, [navigate]);

  const handleSpaceTypeChange = (value: string) => {
    if (spaceType === value) {
      return;
    }
    setSpaceType(value as SpaceType);
    setDetailSelections({});
    setGenerationGuardrailMessage(null);
  };

  const handleDetailChange = (key: string, value: string) => {
    setDetailSelections((prev) => ({ ...prev, [key]: value }));
    setGenerationGuardrailMessage(null);
  };

  const handleInputModeChange = (mode: InputMode) => {
    if (inputMode === mode) {
      if (mode === "describe") {
        setShowChatInput(true);
      }
      return;
    }
    setInputMode(mode);
    setGenerationGuardrailMessage(null);
    if (mode === "describe") {
      setShowChatInput(true);
    } else {
      setShowChatInput(false);
      setCustomPrompt("");
      setChatInput("");
    }
  };

  const startNewImageFlow = () => {
    setIsNewImageFlow(true);
    setSpaceType(null);
    setInputMode(null);
    setDetailSelections({});
    setCustomPrompt("");
    setPendingUserNote(null);
    setShowChatInput(false);
    setChatInput("");
    setUploadedImage(null);
    setImageDimensions(null);
    setGeneratedImage(null);
    setLastGeneratedPrompt("");
    setViewMode("compare");
    setGenerationGuardrailMessage(null);
    fileInputRef.current?.click();
  };

  const runPostGenerationAction = (action: Exclude<PostGenerationAction, null>) => {
    if (action === "make_changes") {
      setInputMode("describe");
      setShowChatInput(true);
      setChatInput("");
      return;
    }
    startNewImageFlow();
  };

  const requestPostGenerationAction = (action: Exclude<PostGenerationAction, null>) => {
    if (generationHistory.length >= MAX_SESSION_GENERATIONS) {
      setSessionEnded(true);
      return;
    }
    if (leadCaptured) {
      runPostGenerationAction(action);
      return;
    }
    setPendingAction(action);
    setLeadGateStep(1);
    setLeadGateOpen(true);
  };

  const handleLeadGateNext = () => {
    if (leadGateStep === 1) {
      const fullName = leadForm.fullName.trim();
      const email = leadForm.email.trim();
      const phone = leadForm.phone.trim();

      if (!fullName || !email || !phone) {
        toast.error("Please fill in all contact details to continue.");
        return;
      }

      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isEmailValid) {
        toast.error("Please enter a valid email address.");
        return;
      }

      setLeadGateStep(2);
      return;
    }

    // Step 2 - submit with timeline
    submitLeadGate();
  };

  const submitLeadGate = async () => {
    const fullName = leadForm.fullName.trim();
    const email = leadForm.email.trim();
    const phone = leadForm.phone.trim();

    setLeadSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        success?: boolean;
        error?: string;
      }>("save-enquiry", {
        body: {
          fullName,
          email,
          phone,
          renovations: ["ai-renovation-generator"],
          suburb: "gold coast",
          postcode: null,
          budget: null,
          timeline: leadForm.timeline || null,
          source: "ai-generator",
          website: "",
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLeadCaptured(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("aiRenovationLeadUnlocked", "true");
      }
      setLeadGateOpen(false);
      toast.success("Thanks! You can continue generating now.");

      if (pendingAction) {
        runPostGenerationAction(pendingAction);
      }
      setPendingAction(null);
    } catch (error) {
      console.error("Lead gate submission failed:", error);
      toast.error("Could not save your details. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const parseFunctionErrorPayload = async (invokeError: unknown) => {
    const typedError = invokeError as FunctionInvokeErrorLike;

    try {
      if (typedError.context && typeof typedError.context.json === "function") {
        const clone = typeof typedError.context.clone === "function" ? typedError.context.clone() : typedError.context;
        return await clone.json();
      }
    } catch {
      // Ignore parse errors and fall back below.
    }

    try {
      if (typedError.context && typeof typedError.context.text === "function") {
        const clone = typeof typedError.context.clone === "function" ? typedError.context.clone() : typedError.context;
        const raw = await clone.text();
        if (!raw) return null;
        try {
          return JSON.parse(raw);
        } catch {
          return { error: raw };
        }
      }
    } catch {
      // Ignore parse errors and fall back below.
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

  const describeLayoutFailureReason = (reason: LayoutFailureReason) => {
    switch (reason) {
      case "structural_edges_changed":
        return "major structural edges shifted";
      case "camera_or_geometry_shifted":
        return "camera perspective or room geometry shifted";
      case "fixtures_or_openings_moved":
        return "doors, windows, or fixtures moved";
      case "room_boundaries_expanded_or_compressed":
        return "room boundaries expanded or compressed";
      default:
        return "layout lock failed";
    }
  };

  const SetupFlow = () => (
    <>
      <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
        <p className="font-medium text-foreground">Hi! Ready to refresh your space?</p>
        <p className="text-xs text-foreground/60 mt-1">
          Upload a clear, front-on photo so I can match your layout. I will keep the layout exactly the same.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 text-[11px] tracking-[0.2em]"
          >
            {uploadedImage ? "Change photo" : "Upload photo"}
          </Button>
        </div>
      </ChatMessage>

      {uploadedImage && (
        <ChatMessage role="user">
          <div className="space-y-3">
            <p>Uploaded a photo.</p>
            <img
              src={uploadedImage}
              alt="Uploaded room photo"
              className="w-full max-w-[260px] sm:max-w-[320px] rounded-xl border border-border"
            />
          </div>
        </ChatMessage>
      )}

      {uploadedImage && (
        <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
          <p className="font-medium text-foreground">Which space is this?</p>
          <p className="text-xs text-foreground/60 mt-1">Pick the room so I can tailor the finishes.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {SPACE_TYPES.map((space) => (
              <button
                key={space.value}
                onClick={() => handleSpaceTypeChange(space.value)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all",
                  spaceType === space.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                {spaceType === space.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <span className="text-2xl mb-2">{space.icon}</span>
                <span
                  className={cn(
                    "text-xs sm:text-sm text-center leading-snug",
                    spaceType === space.value ? "text-primary font-medium" : "text-foreground/70"
                  )}
                >
                  {space.label}
                </span>
              </button>
            ))}
          </div>
        </ChatMessage>
      )}

      {spaceType && (
        <ChatMessage role="user">
          {SPACE_TYPES.find((space) => space.value === spaceType)?.label}
        </ChatMessage>
      )}

      {spaceType && (
        <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
          <p className="font-medium text-foreground">How do you want to guide me?</p>
          <p className="text-xs text-foreground/60 mt-1">Choose quick picks or type your own description.</p>
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <button
              onClick={() => handleInputModeChange("options")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                inputMode === "options" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    inputMode === "options" ? "border-primary bg-primary" : "border-foreground/30"
                  )}
                >
                  {inputMode === "options" && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="font-medium text-foreground">Quick options</span>
              </div>
              <p className="text-xs text-foreground/60 mt-2">Pick from simple, standard finishes.</p>
            </button>
            <button
              onClick={() => handleInputModeChange("describe")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                inputMode === "describe" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    inputMode === "describe" ? "border-primary bg-primary" : "border-foreground/30"
                  )}
                >
                  {inputMode === "describe" && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="font-medium text-foreground">Type what you want</span>
              </div>
              <p className="text-xs text-foreground/60 mt-2">Describe your vision in your own words.</p>
            </button>
          </div>
        </ChatMessage>
      )}

      {spaceType && inputMode === "options" && (
        <ChatMessage role="user">Quick options</ChatMessage>
      )}

      {spaceType && inputMode === "options" && (
        <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
          <p className="font-medium text-foreground">Pick your finishes</p>
          <p className="text-xs text-foreground/60 mt-1">Tap the options that fit your style.</p>
          <div className="space-y-4 mt-4">
            {SPACE_PREFERENCE_FIELDS[spaceType].map((field) => (
              <OptionGroup
                key={field.key}
                label={field.label}
                options={field.options}
                value={detailSelections[field.key]}
                onChange={(value) => handleDetailChange(field.key, value ?? "")}
              />
            ))}
          </div>
        </ChatMessage>
      )}

      {spaceType && inputMode === "describe" && !hasTypedPrompt && (!hasGenerated || isNewImageFlow) && (
        <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
          <p className="font-medium text-foreground">Describe your look</p>
          <p className="text-xs text-foreground/60 mt-1">Type your vision in the message box below.</p>
          <p className="text-xs text-foreground/60 mt-3">
            Example: warm white walls, light stone floors, matte black tapware, soft timber vanity.
          </p>
        </ChatMessage>
      )}

      {pendingUserNote && (!hasGenerated || isNewImageFlow) && (
        <ChatMessage role="user">{pendingUserNote}</ChatMessage>
      )}

      {readyToGenerate && (!hasGenerated || isNewImageFlow) && (
        <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
          <p className="font-medium text-foreground">Ready for your preview?</p>
          <p className="text-xs text-foreground/60 mt-1">
            I will only enhance finishes. Layout, walls, and fixtures stay in place.
          </p>
          {finalPrompt && (
            <p className="text-xs text-foreground/70 mt-3">
              <span className="font-medium text-foreground">Summary:</span> {finalPrompt}
            </p>
          )}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-4"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Renovation Preview
              </span>
            )}
          </Button>
        </ChatMessage>
      )}
    </>
  );

  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setInputMode("describe");
    setCustomPrompt(trimmed);
    setPendingUserNote(trimmed);
    setChatInput("");
    setShowChatInput(false);
    setGenerationGuardrailMessage(null);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const isPortrait = height > width;

        setImageDimensions({ width, height, isPortrait });
        setUploadedImage(base64);
        setGeneratedImage(null);
        setViewMode("compare");
        setLastGeneratedPrompt("");
        setPendingUserNote(null);
        setGenerationGuardrailMessage(null);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!spaceType) {
      toast.error("Please select a space type");
      return;
    }

    if (inputMode === "describe" && !customPrompt.trim()) {
      toast.error("Please describe what you want");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setGenerationGuardrailMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: {
          imageBase64: uploadedImage,
          prompt: finalPrompt,
          spaceType: spaceType,
          imageWidth: imageDimensions?.width,
          imageHeight: imageDimensions?.height,
        },
      });

      if (error) {
        const payload = await parseFunctionErrorPayload(error);

        if (payload?.needClearerPhoto) {
          const warning = payload.error || "Please upload a clearer photo that shows the full room boundaries.";
          setGenerationGuardrailMessage(warning);
          toast.error(warning);
          return;
        }

        if (payload?.layoutChanged || (Array.isArray(payload?.layoutFailureReasons) && payload.layoutFailureReasons.length > 0)) {
          const reasonSummary = Array.isArray(payload?.layoutFailureReasons)
            ? payload.layoutFailureReasons
                .map((reason: LayoutFailureReason) => describeLayoutFailureReason(reason))
                .join(", ")
            : "";
          const warning = payload?.error || "I could not preserve the exact room layout in that result.";
          const fullWarning = reasonSummary
            ? `${warning} Detected issues: ${reasonSummary}.`
            : `${warning} Please upload a clearer, front-on image with full walls, doors, and windows visible.`;
          setGenerationGuardrailMessage(fullWarning);
          toast.error(warning);
          return;
        }

        if (payload?.changeTooSubtle) {
          const warning = payload.error || "The result was too subtle. Try stronger style directions.";
          setGenerationGuardrailMessage(warning);
          toast.error(warning);
          return;
        }

        if (payload?.error) {
          if (payload?.limitReached) {
            const warning =
              payload.error ||
              "Daily limit reached for today. Please come back tomorrow for more generations.";
            setGenerationGuardrailMessage(warning);
            toast.error(warning);
            return;
          }
          throw new Error(payload.error);
        }

        const status = error?.context?.status;
        if (status === 429) {
          const warning = "Daily limit reached for today. Please come back tomorrow for more generations.";
          setGenerationGuardrailMessage(warning);
          toast.error(warning);
          return;
        }

        throw error;
      }

      if (data?.needClearerPhoto) {
        const warning = data.error || "Please upload a clearer photo that shows the full room boundaries.";
        setGenerationGuardrailMessage(warning);
        toast.error(warning);
        return;
      }

      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image was returned. Please try again.");

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const userNote = pendingUserNote ?? null;
      const applySuccessState = () => {
        setLastGeneratedPrompt(finalPrompt);
        setGeneratedImage(data.imageUrl);
        setViewMode("result");
        setGenerationHistory((prev) => [
          ...prev,
          {
            id,
            beforeImage: uploadedImage,
            afterImage: data.imageUrl,
            prompt: finalPrompt,
            userNote,
            spaceType,
            inputMode,
            detailSelections: { ...detailSelections },
            customPrompt,
          },
        ]);
        setIsNewImageFlow(false);
        setPendingUserNote(null);
        setGenerationGuardrailMessage(null);
        toast.success("Design generated successfully!");
      };

      if (data.imageUrl && imageDimensions) {
        const resultImg = new Image();
        resultImg.onload = () => {
          const resultWidth = resultImg.naturalWidth;
          const resultHeight = resultImg.naturalHeight;
          const resultIsPortrait = resultHeight > resultWidth;

          if (resultIsPortrait !== imageDimensions.isPortrait) {
            toast.warning("The generated image orientation doesn't match the original. Comparison may look off.", {
              duration: 5000,
            });
          }
          applySuccessState();
        };
        resultImg.onerror = () => {
          applySuccessState();
        };
        resultImg.src = data.imageUrl;
      } else {
        applySuccessState();
      }
    } catch (error: unknown) {
      console.error("Generation error:", error);
      const warning = error instanceof Error ? error.message : "Failed to generate design. Please try again.";
      setGenerationGuardrailMessage(warning);
      toast.error(warning);
    } finally {
      setIsGenerating(false);
    }
  };
 
  const PreviewPanel = ({ variant = "full" }: { variant?: "full" | "chat" }) => {
    const isChat = variant === "chat";
    return (
      <div
        className={cn(
          "rounded-2xl overflow-hidden flex flex-col",
          isChat ? "border border-border/60 bg-background min-h-[420px]" : "bg-card border border-border min-h-[320px] lg:min-h-[380px]"
        )}
      >
        {!isChat && (
          <div className="px-4 sm:px-5 py-4 border-b border-border">
            <p className="font-medium text-foreground">Upload & Preview</p>
            <p className="text-xs text-foreground/60 mt-1">Your original stays the same layout, we only enhance finishes.</p>
          </div>
        )}

      <div className="flex-1">
        {!uploadedImage ? (
          <div className="h-full p-5 flex items-center justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[420px] py-12 rounded-2xl border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all"
            >
              <Upload className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium text-sm">Tap to upload</p>
              <p className="text-foreground/50 text-xs mt-1">JPG / PNG - Max 10MB</p>
            </button>
          </div>
        ) : isGenerating ? (
          <div className="flex-1 flex items-center justify-center px-6 py-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-[spin_5s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_3s_linear_infinite_reverse]" />
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
              <p className="text-sm sm:text-base text-primary font-medium">
                {loadingMessages[loadingMessageIndex]}
              </p>
            </div>
          </div>
        ) : generatedImage ? (
          <div className="h-full flex flex-col">
            <div className="flex gap-1 p-2 bg-muted/30 border-b border-border">
              <button
                onClick={() => setViewMode("compare")}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm transition-all",
                  viewMode === "compare" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
                )}
              >
                Compare
              </button>
              <button
                onClick={() => setViewMode("result")}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm transition-all",
                  viewMode === "result" ? "bg-background text-foreground shadow-sm" : "text-foreground/60"
                )}
              >
                Result
              </button>
            </div>
            <div className="p-5 flex-1 overflow-auto">
              {viewMode === "compare" ? (
                <ImageComparisonSlider
                  beforeImage={uploadedImage}
                  afterImage={generatedImage}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              ) : (
                <img src={generatedImage} alt="AI-generated renovation preview" className="w-full h-auto rounded-lg" />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full p-4 flex flex-col justify-center gap-3">
            <div
              className="relative rounded-xl cursor-pointer overflow-hidden group border border-border"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={uploadedImage} alt="Uploaded room photo preview" className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Change Image
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-foreground/60 font-medium text-sm">Your image is ready.</p>
              <p className="text-foreground/40 text-xs mt-1">Generate your preview to see the renovation.</p>
            </div>
          </div>
        )}
      </div>

    </div>
    );
  };
 
   return (
     <div className="min-h-screen bg-background overflow-hidden">
      <SEO
        title="AI Renovation Generator | Visualise Your Gold Coast Renovation"
        description="Upload a room photo and preview renovation ideas while preserving your existing layout. Explore finishes, styles, and design direction in seconds."
        url="/design-tools/ai-generator"
      />
       <Header />
 
      <main className="pt-16 md:pt-28 h-[100dvh] overflow-hidden">
        <div className="w-full h-full flex flex-col px-0 md:px-12 md:max-w-7xl md:mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
           {/* Header */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="w-full flex-1 min-h-0">
              <div className="bg-background/80 rounded-none overflow-hidden flex flex-col h-full">
                <div className="px-2 sm:px-3 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center overflow-hidden border border-border shrink-0">
                      {logoSrc ? (
                        <img src={logoSrc} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <span>CDC</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-[13px] sm:text-sm font-medium text-foreground truncate">CDC Renovation Assistant</h1>
                      <h2 className="text-[11px] sm:text-xs text-foreground/60 leading-tight truncate">Chat through a few prompts to build your preview.</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-foreground/60 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Online
                  </div>
                </div>

                <div
                  ref={chatScrollRef}
                  className="flex-1 min-h-0 px-2 sm:px-3 md:px-6 py-3 sm:py-4 md:py-6 space-y-4 sm:space-y-6 bg-background overflow-y-auto pr-1 md:pr-3 chat-scroll"
                >
                  {!hasGenerated && <SetupFlow />}

                  {isInitialGeneration && !isNewImageFlow && (
                    <ChatMessage role="assistant" className="w-full max-w-none bg-transparent border-0 p-0" avatarSrc={logoSrc}>
                      <div className="w-full max-w-[880px] mx-auto">
                        <PreviewErrorBoundary>
                          <PreviewPanel variant="chat" />
                        </PreviewErrorBoundary>
                      </div>
                    </ChatMessage>
                  )}

                  {generationHistory.map((item, index) => (
                    <Fragment key={item.id}>
                      {renderHistoryContext(item, index)}
                      <ChatMessage role="assistant" className="w-full max-w-none bg-transparent border-0 p-0" avatarSrc={logoSrc}>
                        <div className="w-full max-w-[880px] mx-auto">
                          <HistoryPreview beforeImage={item.beforeImage} afterImage={item.afterImage} />
                        </div>
                      </ChatMessage>
                    </Fragment>
                  ))}

                  {hasGenerated && !isNewImageFlow && !sessionEnded && (
                    <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
                      <p className="font-medium text-foreground">Want to make more changes?</p>
                      <p className="text-xs text-foreground/60 mt-1">Tell me what to tweak or try a new image.</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => requestPostGenerationAction("make_changes")}
                          className="h-10 px-4 text-[11px] tracking-[0.2em]"
                        >
                          Make changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => requestPostGenerationAction("generate_more")}
                          className="h-10 px-4 text-[11px] tracking-[0.2em]"
                        >
                          Generate more
                        </Button>
                      </div>
                    </ChatMessage>
                  )}

                  {sessionEnded && (
                    <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
                      <p className="font-medium text-foreground">Your session has ended</p>
                      <p className="text-sm text-foreground/70 mt-2">
                        You've used all {MAX_SESSION_GENERATIONS} previews for this session. If you'd like to explore more designs or get in touch, fill out our enquiry form.
                      </p>
                      <Button
                        type="button"
                        onClick={() => navigate("/get-quote")}
                        className="w-full h-12 text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-4"
                      >
                        Get a Quote
                      </Button>
                    </ChatMessage>
                  )}

                  {pendingUserNote && hasGenerated && !isNewImageFlow && (
                    <ChatMessage role="user">{pendingUserNote}</ChatMessage>
                  )}

                  {hasPendingUpdate && (
                    <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
                      <div className="text-center">
                        <p className="text-base sm:text-lg font-semibold text-foreground">Ready for your updated preview?</p>
                        <p className="text-sm text-foreground/70 mt-2">
                        I will keep the layout and update the finishes based on your new notes.
                        </p>
                        {finalPrompt && (
                          <p className="text-sm text-foreground/70 mt-3">
                            <span className="font-medium text-foreground">Summary:</span> {finalPrompt}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full h-12 text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-5"
                      >
                        {isGenerating ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Generate Updated Preview
                          </span>
                        )}
                      </Button>
                    </ChatMessage>
                  )}

                  {isUpdateGeneration && (
                    <ChatMessage role="assistant" className="w-full max-w-none bg-transparent border-0 p-0" avatarSrc={logoSrc}>
                      <div className="w-full max-w-[880px] mx-auto">
                        <PreviewErrorBoundary>
                          <PreviewPanel variant="chat" />
                        </PreviewErrorBoundary>
                      </div>
                    </ChatMessage>
                  )}

                  {isNewImageFlow && <SetupFlow />}

                  {isNewImageFlow && isInitialGeneration && (
                    <ChatMessage role="assistant" className="w-full max-w-none bg-transparent border-0 p-0" avatarSrc={logoSrc}>
                      <div className="w-full max-w-[880px] mx-auto">
                        <PreviewErrorBoundary>
                          <PreviewPanel variant="chat" />
                        </PreviewErrorBoundary>
                      </div>
                    </ChatMessage>
                  )}

                  {generationGuardrailMessage && !isGenerating && (
                    <ChatMessage role="assistant" className="max-w-full" avatarSrc={logoSrc}>
                      <p className="font-medium text-foreground">I need one adjustment before generating.</p>
                      <p className="text-xs text-foreground/70 mt-2">{generationGuardrailMessage}</p>
                    </ChatMessage>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                <div className="border-t border-border/40 bg-background/90 p-2 sm:p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          if (!showChatInput) return;
                          handleSendChat();
                        }
                      }}
                      placeholder={
                        showChatInput
                          ? hasGenerated && !isNewImageFlow
                            ? "Describe what you'd like to change..."
                            : "Describe your vision..."
                          : "Complete the step above to continue."
                      }
                      disabled={!showChatInput}
                      className="min-h-[48px] max-h-[140px] resize-none bg-background flex-1 disabled:opacity-60"
                    />
                    <Button
                      type="button"
                      onClick={handleSendChat}
                      disabled={!showChatInput}
                      className="h-10 sm:h-11 px-6 text-[11px] tracking-[0.2em]"
                    >
                      Send
                    </Button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-foreground/50 mt-2">
                    AI previews are indicative and may vary from final build outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
         </div>
       </main>

      <Dialog open={leadGateOpen} onOpenChange={setLeadGateOpen}>
        <DialogContent className="max-w-md w-[94vw]">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl text-primary">
              {leadGateStep === 1 ? "Continue Generating" : "One more thing"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {leadGateStep === 1 ? (
              <>
                <p className="text-sm text-foreground/75">
                  To continue generating more versions, please share your contact details.
                </p>
                <p className="text-xs text-foreground/60">
                  We only use this to follow up on your renovation enquiry. No spam.
                </p>
                <div className="space-y-3 pt-1">
                  <Input
                    value={leadForm.fullName}
                    onChange={(event) =>
                      setLeadForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                    placeholder="Full name"
                    className="h-11"
                  />
                  <Input
                    type="email"
                    value={leadForm.email}
                    onChange={(event) =>
                      setLeadForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Email address"
                    className="h-11"
                  />
                  <Input
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="Phone number"
                    className="h-11"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground/75">
                  How soon are you planning your renovation?
                </p>
                <div className="space-y-2 pt-1">
                  {[
                    { value: "immediately", label: "Ready to start" },
                    { value: "30-days", label: "In the next 30 days" },
                    { value: "90-days", label: "Within 90 days" },
                    { value: "exploring", label: "Just exploring" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLeadForm((prev) => ({ ...prev, timeline: option.value }))}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm",
                        leadForm.timeline === option.value
                          ? "border-primary bg-primary/5 text-foreground font-medium"
                          : "border-border bg-card text-foreground/70 hover:border-primary/30"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <Button
              type="button"
              onClick={handleLeadGateNext}
              disabled={leadSubmitting || (leadGateStep === 2 && !leadForm.timeline)}
              className="w-full h-11 text-[11px] tracking-[0.2em]"
            >
              {leadSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting
                </span>
              ) : leadGateStep === 1 ? (
                "Next"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
     </div>
   );
 };
 
 export default AIDesignGenerator;
