
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language: "sql" | "python";
  validationError?: string | null;
  rows?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  language,
  validationError,
  rows = 6,  // Default to 6 rows
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize the editor based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={`border rounded-md font-mono text-sm relative overflow-hidden ${validationError ? 'border-red-500' : 'bg-muted/30'}`}>
      <ScrollArea className="h-[200px] w-full overflow-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-mono text-sm p-4 bg-transparent resize-none outline-none"
          style={{ minWidth: "100%" }}
          placeholder={placeholder}
          data-language={language}
          rows={rows}
        />
      </ScrollArea>
      {validationError && (
        <div className="text-red-500 text-sm mt-2 p-2">
          {validationError}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
