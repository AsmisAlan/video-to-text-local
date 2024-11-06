"use client";

import { Card } from "@/components/ui/card";
import { FileIcon, UploadIcon } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploader({
  file,
  onFileSelect,
  isProcessing,
}: FileUploaderProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isProcessing ? "opacity-50" : "hover:border-primary cursor-pointer"
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        if (!isProcessing) {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "audio/*,video/*";
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files?.length) {
              onFileSelect(files[0]);
            }
          };
          input.click();
        }
      }}
    >
      {file ? (
        <div className="flex items-center justify-center space-x-2">
          <FileIcon className="w-6 h-6" />
          <span>{file.name}</span>
        </div>
      ) : (
        <div className="space-y-2">
          <UploadIcon className="w-8 h-8 mx-auto" />
          <p>Drag and drop a video or audio file here, or click to select</p>
          <p className="text-sm text-muted-foreground">
            Supported formats: MP4, MP3, WAV, and more
          </p>
        </div>
      )}
    </Card>
  );
}