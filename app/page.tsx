"use client";

import { FileUploader } from "@/components/FileUploader";
import { TranscriptionProgress } from "@/components/TranscriptionProgress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [progress, setProgress] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTranscription = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress([]);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line);
          if (data.type === "progress") {
            setProgress((prev) => [...prev, data.message]);
          } else if (data.type === "result") {
            setTranscription(data.text);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Mic className="w-8 h-8" />
          <h1 className="text-3xl font-bold text-center">
            Video/Audio Transcription
          </h1>
        </div>

        <FileUploader
          file={file}
          onFileSelect={setFile}
          isProcessing={isProcessing}
        />

        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleStartTranscription}
            disabled={!file || isProcessing}
          >
            Start Transcription
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!transcription}
            variant="outline"
          >
            Download Transcription
          </Button>
        </div>

        <TranscriptionProgress
          progress={progress}
          transcription={transcription}
        />
      </Card>
    </main>
  );
}