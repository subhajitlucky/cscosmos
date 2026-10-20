import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=token", request.url));
  }

  try {
    const user = await verifyMagicLink(token);
    if (!user) {
      return NextResponse.redirect(new URL("/login?error=expired", request.url));
    }
    return NextResponse.redirect(new URL("/progress?login=1", request.url));
  } catch (error) {
    console.error("[auth/verify] failed:", error);
    return NextResponse.redirect(new URL("/login?error=failed", request.url));
  }
}
