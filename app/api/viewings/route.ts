import { NextResponse } from "next/server";
import { createViewing, SlotTaken, upsertLead } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  try { const v = await createViewing({ ...b, source: "form" }); await upsertLead(b.sessionId || v.ref, { name: v.name, phone: v.phone, email: v.email, viewings: [v.ref], interested: [v.propertyId] }, "form").catch(() => {}); return NextResponse.json({ ok: true, viewing: v }); }
  catch (e: any) { if (e instanceof SlotTaken) return NextResponse.json({ ok: false, error: "Sorry, that slot was just taken. Please pick another time." }, { status: 409 }); return NextResponse.json({ ok: false, error: e?.message || "Could not book" }, { status: 400 }); }
}
