import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content || {});
}
