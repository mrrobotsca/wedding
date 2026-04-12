import { NextRequest, NextResponse } from "next/server";
import { getGuest } from "@/lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const guest = getGuest(id);
  if (!guest) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });

  return NextResponse.json(guest);
}
