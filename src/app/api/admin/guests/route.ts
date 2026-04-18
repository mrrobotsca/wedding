import { NextRequest, NextResponse } from "next/server";
import { getGuests, getGuest, saveGuest, deleteGuest, validateAdminToken } from "@/lib/db";

async function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token || !(await validateAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;

  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const guest = await getGuest(id);
    if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(guest);
  }
  return NextResponse.json(await getGuests());
}

export async function POST(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;

  const body = await req.json();
  const guest = await saveGuest({
    greetingName: body.greetingName || "Guest",
    inviteType: body.inviteType || "individual",
    allowCompanion: body.allowCompanion ?? false,
    familyMembers: body.familyMembers || [],
  });
  return NextResponse.json(guest, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const existing = await getGuest(body.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = { ...existing, ...body };
  await saveGuest(updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteGuest(id);
  return NextResponse.json({ ok: true });
}
