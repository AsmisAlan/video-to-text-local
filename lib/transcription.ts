import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = createFFmpeg({ log: true });

export async function convertToWav(file: File): Promise<Uint8Array> {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", "input", await fetchFile(file));

  await ffmpeg.run("-i", "input", "-ar", "16000", "-ac", "1", "output.wav");

  const data = ffmpeg.FS("readFile", "output.wav");
  ffmpeg.FS("unlink", "input");
  ffmpeg.FS("unlink", "output.wav");

  return data;
}