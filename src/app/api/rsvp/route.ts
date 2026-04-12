import { NextRequest, NextResponse } from "next/server";
import { getGuest, getRSVP, saveRSVP, logActivity } from "@/lib/db";

// GET — check if already submitted
export async function GET(req: NextRequest) {
  const guestId = req.nextUrl.searchParams.get("guestId");
  if (!guestId) return NextResponse.json({ error: "Missing guestId" }, { status: 400 });

  const rsvp = getRSVP(guestId);
  if (!rsvp) return NextResponse.json({ submitted: false });
  return NextResponse.json({ submitted: true, ...rsvp });
}

// POST — submit RSVP
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.guestId) return NextResponse.json({ error: "Missing guestId" }, { status: 400 });

  const guest = getGuest(body.guestId);
  if (!guest) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });

  const rsvp = {
    guestId: body.guestId,
    attending: body.attending ?? true,
    mealChoice: body.mealChoice || "",
    allergies: body.allergies || "",
    companionName: body.companionName || "",
    companionMeal: body.companionMeal || "",
    familyMeals: body.familyMeals || {},
    phone: body.phone || "",
    song: body.song || "",
    message: body.message || "",
    submittedAt: new Date().toISOString(),
  };
  saveRSVP(rsvp);

  logActivity({
    guestId: body.guestId,
    event: "rsvp_submitted",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
