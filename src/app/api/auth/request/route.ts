import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { requestMagicLink } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Accounts are not configured yet." },
      { status: 503 }
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.ALERT_FROM_EMAIL) {
    return NextResponse.json(
      { ok: false, error: "Sign-in email is not configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown }).email === "string"
    ? (body as { email: string }).email.trim().toLowerCase()
    : "";

  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const recent = await getPool().query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM cscosmos_login_tokens
     WHERE email = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
    [email]
  );

  if (Number(recent.rows[0]?.count ?? 0) >= 3) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  try {
    await requestMagicLink(email, request.url);
    return NextResponse.json({ ok: true, message: "Check your inbox for a sign-in link." });
  } catch (error) {
    console.error("[auth/request] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send the sign-in email. Try again later." },
      { status: 502 }
    );
  }
}
