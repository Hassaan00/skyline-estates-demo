import { NextResponse } from "next/server";
import { listLeads, listViewings, storageName } from "@/lib/store";
export const dynamic = "force-dynamic";
const mask = (s?: string) => (s ? s.replace(/^(.{2}).*(@.*)$/, "$1•••$2").replace(/^(\+?\d{3}).*(\d{2})$/, "$1•••$2") : undefined);
export async function GET() {
  const [leads, viewings] = await Promise.all([listLeads(), listViewings()]);
  return NextResponse.json({ storage: storageName, leads: leads.slice(0, 100).map((l) => ({ ...l, email: mask(l.email), phone: mask(l.phone) })), viewings: viewings.slice(0, 100).map((v) => ({ ...v, email: mask(v.email), phone: mask(v.phone), sessionId: undefined })) });
}
