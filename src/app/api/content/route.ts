import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content || {});
}
