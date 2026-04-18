import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs, getGuests, validateAdminToken } from "@/lib/db";

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

  const guestId = req.nextUrl.searchParams.get("guestId");
  const logs = await getActivityLogs(guestId || undefined);
  const guests = await getGuests();

  const enriched = logs.map((log) => {
    const guest = guests.find((g) => g.id === log.guestId);
    return { ...log, guestName: guest?.greetingName || "Unknown" };
  });

  return NextResponse.json(enriched);
}
