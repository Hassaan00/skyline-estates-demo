import { NextResponse } from "next/server";
import { availability } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(req: Request) { const u = new URL(req.url); return NextResponse.json(await availability(u.searchParams.get("property") || "", u.searchParams.get("date") || "")); }
