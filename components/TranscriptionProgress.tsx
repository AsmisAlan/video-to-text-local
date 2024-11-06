"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface TranscriptionProgressProps {
  progress: string[];
  transcription: string;
}

export function TranscriptionProgress({
  progress,
  transcription,
}: TranscriptionProgressProps) {
  if (!progress.length && !transcription) return null;

  return (
    <div className="space-y-4">
      {progress.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Progress</h2>
          <ScrollArea className="h-[200px]">
            <pre className="text-sm whitespace-pre-wrap">
              {progress.join("\n")}
            </pre>
          </ScrollArea>
        </Card>
      )}

      {transcription && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Transcription</h2>
          <ScrollArea className="h-[300px]">
            <pre className="text-sm whitespace-pre-wrap">{transcription}</pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}