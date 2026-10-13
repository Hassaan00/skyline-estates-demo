"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Mic, MicOff, CalendarCheck2, Check, AudioLines, Keyboard, Volume2, Square, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { agentCfg as A } from "@/lib/agent";
import Thumb from "@/components/Thumb";

type BookingCard = { ref: string; title: string; href?: string; lines: [string, string][] };
type Item = { id: string; title: string; sub: string; price: string; alt?: string; href: string; art: any };
type Msg = { role: "user" | "assistant"; content: string; booking?: BookingCard; items?: Item[] };
const LANG_KEYS = Object.keys(A.langs);

function pickVoice(bcp: string) {
  const vs = window.speechSynthesis?.getVoices() || []; const base = bcp.slice(0, 2);
  const same = vs.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(base));
  for (const p of [A.voices, /female|Google|Microsoft/i]) { const v = same.find((x) => p.test(x.name)); if (v) return v; }
  return same[0];
}
function Wave({ active, level }: { active: boolean; level: number }) {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, i) => { const c = 1 - Math.abs(i - 7) / 8;
        return <motion.span key={i} className="w-1 rounded-full bg-gradient-to-t from-accent-600 to-accent-200"
          animate={{ height: active ? [6, 6 + (22 + level * 40) * c * (0.6 + ((i * 37) % 10) / 20), 6] : 6 }}
          transition={{ duration: 0.5 + (i % 4) * 0.12, repeat: active ? Infinity : 0, ease: "easeInOut" }} />; })}
    </div>
  );
}

export default function ChatWidget() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [lang, setLang] = useState(LANG_KEYS[0]);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: A.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [vstate, setVstate] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [interim, setInterim] = useState("");
  const [level, setLevel] = useState(0.3);
  const [support, setSupport] = useState<"native" | "record" | "none">("native");
  const [sid, setSid] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null); const mediaRef = useRef<MediaRecorder | null>(null);
  const msgsRef = useRef(msgs); msgsRef.current = msgs;
  const modeRef = useRef(mode); modeRef.current = mode;

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupport(SR ? "native" : typeof MediaRecorder !== "undefined" && navigator.mediaDevices ? "record" : "none");
    window.speechSynthesis?.getVoices();
    let s = sessionStorage.getItem(A.sessionKey); if (!s) { s = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem(A.sessionKey, s); } setSid(s);
    const o = (e: Event) => { setOpen(true); const t = (e as CustomEvent).detail; if (typeof t === "string" && t) setTimeout(() => sendRef.current(t), 250); };
    const v = () => { setOpen(true); setMode("voice"); };
    window.addEventListener("open-chat", o); window.addEventListener("open-voice", v);
    return () => { window.removeEventListener("open-chat", o); window.removeEventListener("open-voice", v); };
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, interim]);
  useEffect(() => { if (!open || mode === "text") stopAll(); }, [open, mode]); // eslint-disable-line

  function stopAll() { try { recRef.current?.abort(); } catch {} try { mediaRef.current?.state === "recording" && mediaRef.current.stop(); } catch {} window.speechSynthesis?.cancel(); setVstate("idle"); setInterim(""); }

  const speak = useCallback((text: string, done?: () => void) => {
    const ss = window.speechSynthesis; if (!ss) { done?.(); return; }
    ss.cancel(); const u = new SpeechSynthesisUtterance(text.replace(A.spell[0], A.spell[1]).replace(/[*_#]/g, ""));
    const L = A.langs[lang]; const bcp = /[\u0600-\u06FF]/.test(text) ? "ar-AE" : L.bcp;
    u.lang = bcp; const v = pickVoice(bcp); if (v) u.voice = v; u.rate = 1.02; u.pitch = 1.03;
    setVstate("speaking"); u.onend = () => { setVstate("idle"); done?.(); }; u.onerror = () => { setVstate("idle"); done?.(); };
    ss.speak(u);
  }, [lang]);

  async function send(text: string, channel: "chat" | "voice" = "chat") {
    if (!text.trim()) return;
    const next = [...msgsRef.current, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput(""); setTyping(true); if (channel === "voice") setVstate("thinking");
    let reply = `Sorry, I lost connection. Please call ${A.phone}.`;
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel, sessionId: sid || sessionStorage.getItem(A.sessionKey), messages: next.map(({ role, content }) => ({ role, content })) }) });
      const j = await r.json(); reply = j.reply;
      setMsgs([...next, { role: "assistant", content: j.reply, booking: j.booking || undefined, items: j.items?.length ? j.items : undefined }]);
    } catch { setMsgs([...next, { role: "assistant", content: reply }]); }
    setTyping(false);
    if (channel === "voice" && modeRef.current === "voice") speak(reply); else if (channel === "voice") setVstate("idle");
  }
  const sendRef = useRef(send); sendRef.current = send;

  function listen() {
    window.speechSynthesis?.cancel();
    if (support === "native") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR(); recRef.current = rec; rec.lang = A.langs[lang].bcp; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      let finalText = "";
      rec.onstart = () => setVstate("listening");
      rec.onresult = (e: any) => { let t = ""; for (let i = 0; i < e.results.length; i++) { t += e.results[i][0].transcript; if (e.results[i].isFinal) finalText = t; } setInterim(t); setLevel(0.3 + Math.random() * 0.7); };
      rec.onerror = (e: any) => { setVstate("idle"); setInterim(e.error === "not-allowed" ? "Microphone permission was blocked. Allow it in your browser, or type instead." : e.error === "no-speech" ? "I didn't catch that. Tap the mic and try again." : ""); };
      rec.onend = () => { const t = (finalText || "").trim(); setInterim(""); if (t) send(t, "voice"); else setVstate((s) => (s === "listening" ? "idle" : s)); };
      try { rec.start(); } catch { setVstate("idle"); }
      return;
    }
    if (support === "record") {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mr = new MediaRecorder(stream); mediaRef.current = mr; const chunks: Blob[] = [];
        mr.ondataavailable = (e) => chunks.push(e.data);
        mr.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop()); setVstate("thinking"); setInterim("Transcribing…");
          const fd = new FormData(); fd.append("file", new Blob(chunks, { type: mr.mimeType || "audio/webm" }), "audio.webm"); fd.append("lang", A.langs[lang].bcp.slice(0, 2));
          try { const r = await fetch("/api/stt", { method: "POST", body: fd }); const j = await r.json(); setInterim(""); if (j.text?.trim()) send(j.text.trim(), "voice"); else { setVstate("idle"); setInterim("I didn't catch that. Try again."); } }
          catch { setVstate("idle"); setInterim("Transcription failed. Please type instead."); }
        };
        mr.start(); setVstate("listening");
      }).catch(() => { setVstate("idle"); setInterim("Microphone permission was blocked. Allow it in your browser, or type instead."); });
    }
  }
  function stopListening() { try { recRef.current?.stop(); } catch {} if (mediaRef.current?.state === "recording") mediaRef.current.stop(); }

  if (path?.startsWith("/admin")) return null;
  const vLabel = { idle: support === "record" ? "Tap to record, tap again to send" : "Tap the orb and speak", listening: A.langs[lang].listen, thinking: `${A.name} is thinking…`, speaking: `${A.name} is speaking` }[vstate];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.25 }}
            role="dialog" aria-label={`${A.name}, AI assistant`}
            className="fixed bottom-24 right-3 z-[70] flex h-[min(680px,calc(100dvh-8rem))] w-[calc(100vw-1.5rem)] max-w-[410px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-950/95 text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,.7)] backdrop-blur-2xl sm:right-6">
            <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent-300 to-accent-600 text-ink-950"><Sparkles size={18} /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-950 bg-emerald-400" /></div>
              <div className="flex-1"><p className="text-sm font-semibold">{A.name}</p><p className="whitespace-nowrap text-xs text-white/50">{A.role}</p></div>
              <div className="flex rounded-full bg-white/10 p-0.5 text-xs" role="tablist" aria-label="Mode">
                <button role="tab" aria-selected={mode === "text"} onClick={() => setMode("text")} className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${mode === "text" ? "bg-white text-ink-950" : "text-white/60"}`}><Keyboard size={12} />Chat</button>
                <button role="tab" aria-selected={mode === "voice"} onClick={() => setMode("voice")} className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${mode === "voice" ? "bg-white text-ink-950" : "text-white/60"}`}><AudioLines size={12} />Talk</button>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-white/10"><X size={18} /></button>
            </header>

            {mode === "voice" ? (
              <div className="relative flex flex-1 flex-col overflow-hidden">
                <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
                <div className="relative flex justify-center gap-1 pt-4">
                  {LANG_KEYS.map((l) => <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`rounded-full px-3 py-1 text-xs ${lang === l ? "bg-accent-400 text-ink-950" : "bg-white/10 text-white/70 hover:bg-white/15"}`}>{A.langs[l].label}</button>)}
                </div>
                {support === "none" ? (
                  <div className="relative m-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100" role="status">
                    <p className="font-semibold">Voice isn&apos;t supported in this browser</p>
                    <p className="mt-1 text-amber-100/80">Use Chrome, Edge or Safari for voice, or switch to Chat. {A.name} books the same way by text.</p>
                    <button onClick={() => setMode("text")} className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-ink-950">Switch to chat</button>
                  </div>
                ) : (
                  <div className="relative flex flex-1 flex-col items-center justify-center px-6">
                    <div className="relative">
                      {vstate === "listening" && [0, 1].map((k) => <motion.span key={k} className="absolute inset-0 rounded-full border border-accent-300/60" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.8, repeat: Infinity, delay: k * 0.9 }} />)}
                      <button onClick={vstate === "listening" ? stopListening : vstate === "speaking" ? () => { window.speechSynthesis.cancel(); setVstate("idle"); } : listen} disabled={vstate === "thinking"}
                        aria-label={vstate === "listening" ? "Stop listening" : vstate === "speaking" ? "Stop speaking" : "Start talking"}
                        className={`relative grid h-28 w-28 place-items-center rounded-full text-ink-950 shadow-[0_0_80px_-10px] shadow-accent-400/60 transition ${vstate === "listening" ? "bg-rose-400" : "bg-[radial-gradient(circle_at_30%_25%,var(--tw-gradient-stops))] from-accent-100 via-accent-400 to-accent-700"} disabled:opacity-60`}>
                        {vstate === "listening" ? (support === "record" ? <Square size={28} fill="currentColor" /> : <MicOff size={30} />) : vstate === "speaking" ? <Volume2 size={30} /> : <Mic size={34} />}
                      </button>
                    </div>
                    <div className="mt-6"><Wave active={vstate === "listening" || vstate === "speaking"} level={vstate === "speaking" ? 0.6 : level} /></div>
                    <p className="text-sm font-medium" aria-live="polite">{vLabel}</p>
                    <p dir="auto" className="mt-3 min-h-[3rem] max-w-xs text-center text-sm text-white/60">{interim || (vstate === "idle" && msgs.length < 2 ? `Try: “${A.langs[lang].tryText}”` : "")}</p>
                  </div>
                )}
                <div className="relative max-h-52 space-y-2 overflow-y-auto border-t border-white/10 bg-black/30 p-3">
                  {msgs.slice(-4).map((m, i) => m.booking ? <BookingCardView key={i} b={m.booking} /> : (
                    <p dir="auto" key={i} className={`text-xs leading-relaxed ${m.role === "user" ? "text-right text-white/50" : "text-white/85"}`}><span className="font-semibold">{m.role === "user" ? "You" : A.name}:</span> {m.content}</p>))}
                  <div ref={end} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <p dir="auto" className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-md bg-accent-400 text-ink-950" : "rounded-bl-md border border-white/10 bg-white/[.06] text-white/90"}`}>{m.content}</p>
                      {m.items && <div className="flex w-full gap-2 overflow-x-auto pb-1">{m.items.map((it) => (
                        <Link key={it.id} href={it.href} className="group w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] hover:border-accent-300/50">
                          <div className="h-20 overflow-hidden"><Thumb art={it.art} id={it.id} /></div>
                          <div className="p-2.5"><p className="truncate text-[12px] font-semibold">{it.title}</p><p className="truncate text-[10.5px] text-white/50">{it.sub}</p>
                            <p className="mt-1 flex items-center justify-between text-[12px] font-semibold text-accent-200">{it.price}<ArrowUpRight size={13} className="opacity-50 group-hover:opacity-100" /></p></div>
                        </Link>))}</div>}
                      {m.booking && <BookingCardView b={m.booking} />}
                    </div>
                  ))}
                  {typing && <div className="flex w-16 items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[.06] px-4 py-3" aria-label={`${A.name} is typing`}>{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" style={{ animationDelay: `${d * 0.15}s` }} />)}</div>}
                  <div ref={end} />
                </div>
                <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2.5">
                  {A.quick.map((q) => <button dir="auto" key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:border-accent-300 hover:text-accent-200">{q}</button>)}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (!typing) send(input); }} className="flex items-center gap-2 border-t border-white/10 p-3">
                  <label htmlFor="chat-in" className="sr-only">Message</label>
                  <button type="button" onClick={() => setMode("voice")} aria-label={`Talk to ${A.name} by voice`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 hover:border-accent-300 hover:text-accent-200"><Mic size={17} /></button>
                  <input dir="auto" id="chat-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything, in any language…" className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[.06] px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-300" />
                  <button aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-400 text-ink-950 hover:bg-accent-300 disabled:opacity-50" disabled={typing}><Send size={16} /></button>
                </form>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} aria-label={open ? `Close ${A.name}` : `Chat with ${A.name}, AI assistant`}
        className="fixed bottom-5 right-4 z-[70] flex items-center gap-2 rounded-full border border-white/15 bg-ink-950 py-3 pl-4 pr-5 text-sm font-medium text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,.6)] transition hover:scale-[1.03] sm:right-6">
        {open ? <X size={18} /> : <MessageCircle size={18} className="text-accent-300" />}<span className="hidden sm:inline">{open ? "Close" : `${A.fab} · 24/7`}</span>
        {!open && <span className="absolute -top-0.5 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-ink-950" />}
      </button>
    </>
  );
}

function BookingCardView({ b }: { b: BookingCard }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-[88%] overflow-hidden rounded-2xl border border-accent-300/30 bg-accent-400/10">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-400 text-ink-950"><CalendarCheck2 size={17} /></div>
        <div className="flex-1"><p className="text-[13px] font-semibold text-white">{b.title}</p><p className="text-[11px] text-white/60">Ref <span className="font-mono font-semibold tracking-wide text-accent-200">{b.ref}</span></p></div>
        <Check size={18} className="text-accent-300" />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-white/10 px-4 py-3 text-[12px] text-white/85">
        {b.lines.map(([k, v]) => <Fragment key={k}><dt className="opacity-50">{k}</dt><dd className="text-right font-medium">{v}</dd></Fragment>)}
      </dl>
    </motion.div>
  );
}
