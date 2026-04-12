import { NextRequest, NextResponse } from "next/server";
import { getGuest, logActivity } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.guestId || !body.event) {
    return NextResponse.json({ error: "Missing guestId or event" }, { status: 400 });
  }

  const guest = getGuest(body.guestId);
  if (!guest) return NextResponse.json({ error: "Invalid guest" }, { status: 404 });

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  logActivity({
    guestId: body.guestId,
    event: body.event,
    userAgent: req.headers.get("user-agent") || undefined,
    ip,
    fingerprint: body.fingerprint || undefined,
    device: body.device || undefined,
    screenSize: body.screenSize || undefined,
    language: body.language || undefined,
    platform: body.platform || undefined,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
