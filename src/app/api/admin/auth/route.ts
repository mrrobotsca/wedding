import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken, validateAdminPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!(await validateAdminToken(token))) {
    return NextResponse.json({ error: "Invalid admin link" }, { status: 403 });
  }
  if (!(await validateAdminPassword(password))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
