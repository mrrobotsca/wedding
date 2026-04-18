import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, validateAdminToken } from "@/lib/db";

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
  const content = await getSiteContent();
  return NextResponse.json(content || {});
}

export async function POST(req: NextRequest) {
  const err = await checkAuth(req);
  if (err) return err;
  const body = await req.json();
  const saved = await saveSiteContent(body);
  return NextResponse.json(saved);
}
