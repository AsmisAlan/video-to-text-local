import { NextRequest } from "next/server";
import { pipeline } from "@xenova/transformers/dist/transformers.min.js";

let transcriber: any = null;

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as File;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const sendProgress = (message: string) => {
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({ type: "progress", message }) + "\n"
            )
          );
        };

        sendProgress("Loading transcription model...");

        if (!transcriber) {
          transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
            progress_callback: (progress: any) => {
              if (progress.status === "progress") {
                sendProgress(`Loading model: ${Math.round(progress.value * 100)}%`);
              }
            }
          });
        }

        const arrayBuffer = await file.arrayBuffer();
        sendProgress("Processing audio...");

        const result = await transcriber(new Blob([arrayBuffer]), {
          chunk_length_s: 30,
          stride_length_s: 5,
          return_timestamps: true,
          callback_function: (progress: any) => {
            if (progress.status === "progress") {
              sendProgress(`Transcribing: ${Math.round(progress.value * 100)}%`);
            }
          }
        });

        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({ type: "result", text: result.text }) + "\n"
          )
        );
        controller.close();
      } catch (error) {
        console.error("Error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}