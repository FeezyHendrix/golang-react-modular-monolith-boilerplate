
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";

type ChatInputProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  hasAnyItemSelected: boolean;
  isProcessingData: boolean;
  isProcessingDoc: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSubmit,
  hasAnyItemSelected,
  isProcessingData,
  isProcessingDoc,
}) => {
  return (
    <div className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your data..."
          className="pr-24 pl-10 py-6 bg-muted/30"
          disabled={!hasAnyItemSelected || (!isProcessingData && !isProcessingDoc)}
        />
        <Send className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <div className="absolute right-3 top-2.5">
          <Button type="submit" size="icon" variant="ghost" className="h-6 w-6" disabled={!hasAnyItemSelected || (!isProcessingData && !isProcessingDoc)}>
            <Mic size={18} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {!hasAnyItemSelected 
            ? "Please note: This system utilizes AI to analyze your selected data sources and documents. All outputs should be validated against source data as AI-generated insights may require human verification." 
            : (!isProcessingData && !isProcessingDoc)
              ? "Toggle the process switches to enable AI analysis"
              : "AI responds based on your provided data and instructions"}
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
