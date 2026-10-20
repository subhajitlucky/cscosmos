import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
