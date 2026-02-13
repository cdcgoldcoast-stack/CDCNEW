import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Minus, Plus, Sun, Send, Undo2, MessageSquare } from "lucide-react";

interface ContentRefinementButtonsProps {
  fieldName: string;
  currentContent: string;
  previousContent: string | null;
  onRefine: (action: string, customPrompt?: string) => void;
  onUndo: () => void;
  isRefining: boolean;
}

const ContentRefinementButtons = ({
  fieldName,
  currentContent,
  previousContent,
  onRefine,
  onUndo,
  isRefining,
}: ContentRefinementButtonsProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      onRefine("custom", customPrompt);
      setCustomPrompt("");
      setShowCustomInput(false);
    }
  };

  if (!currentContent.trim()) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {previousContent && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={isRefining}
            className="text-xs border-orange-500/50 text-orange-600 hover:bg-orange-50"
          >
            <Undo2 className="w-3 h-3 mr-1" />
            Undo
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRefine("rewrite")}
          disabled={isRefining}
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Rewrite
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRefine("shorten")}
          disabled={isRefining}
          className="text-xs"
        >
          <Minus className="w-3 h-3 mr-1" />
          Shorten
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRefine("lengthen")}
          disabled={isRefining}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Lengthen
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRefine("lighter")}
          disabled={isRefining}
          className="text-xs"
        >
          <Sun className="w-3 h-3 mr-1" />
          Lighter Tone
        </Button>
        <Button
          type="button"
          variant={showCustomInput ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={isRefining}
          className="text-xs"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Custom
        </Button>
      </div>

      {/* Custom prompt input - only shown when Custom is clicked */}
      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter your custom request..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCustomSubmit();
              }
            }}
            className="text-sm h-8"
            disabled={isRefining}
            autoFocus
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCustomSubmit}
            disabled={isRefining || !customPrompt.trim()}
            className="h-8"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentRefinementButtons;
