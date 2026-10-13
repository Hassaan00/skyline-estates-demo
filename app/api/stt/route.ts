import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "Speech-to-text unavailable" }, { status: 503 });
  const form = await req.formData(); const file = form.get("file") as File | null; const lang = String(form.get("lang") || "en").slice(0, 2);
  if (!file || file.size > 8_000_000) return NextResponse.json({ error: "No audio" }, { status: 400 });
  const fd = new FormData(); fd.append("file", file, "audio.webm"); fd.append("model", "whisper-large-v3-turbo"); fd.append("language", lang); fd.append("response_format", "json");
  const r = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: fd });
  if (!r.ok) return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
  const j = await r.json(); return NextResponse.json({ text: j.text || "" });
}
