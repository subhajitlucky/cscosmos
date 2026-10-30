import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { siteConfig } from "@/config/site";

export const SESSION_COOKIE = "cs_session";
const SESSION_DAYS = 30;
const TOKEN_MINUTES = 15;

export interface SessionUser {
  id: string;
  email: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function siteUrl(requestUrl: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (siteConfig.url) {
    return siteConfig.url.replace(/\/$/, "");
  }
  return new URL(requestUrl).origin.replace(/\/$/, "");
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isDatabaseConfigured()) return null;

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const result = await getPool().query<SessionUser>(
      `SELECT u.id, u.email
       FROM cscosmos_sessions s
       JOIN cscosmos_users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [hashToken(token)]
    );
    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}

async function sendMagicLinkEmail(email: string, link: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and ALERT_FROM_EMAIL are required");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Sign in to CSCosmos",
      text: [
        "Click the link below to sign in. It expires in 15 minutes and can be used once.",
        "",
        link,
        "",
        "If you did not request this, ignore this email.",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error ${response.status}`);
  }
}

export async function requestMagicLink(email: string, requestUrl: string): Promise<void> {
  if (!isDatabaseConfigured()) throw new Error("Auth database is not configured");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_MINUTES * 60 * 1000);
  const pool = getPool();

  await pool.query("DELETE FROM cscosmos_login_tokens WHERE email = $1 AND used_at IS NULL", [email]);
  await pool.query(
    "INSERT INTO cscosmos_login_tokens (email, token_hash, expires_at) VALUES ($1, $2, $3)",
    [email, hashToken(token), expiresAt]
  );

  const link = `${siteUrl(requestUrl)}/api/auth/verify?token=${token}`;
  await sendMagicLinkEmail(email, link);
}

export async function verifyMagicLink(token: string): Promise<SessionUser | null> {
  if (!isDatabaseConfigured()) return null;

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const tokenResult = await client.query<{ email: string }>(
      `UPDATE cscosmos_login_tokens
       SET used_at = NOW()
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       RETURNING email`,
      [hashToken(token)]
    );

    const email = tokenResult.rows[0]?.email;
    if (!email) {
      await client.query("ROLLBACK");
      return null;
    }

    const userResult = await client.query<SessionUser>(
      `INSERT INTO cscosmos_users (email, last_login_at)
       VALUES ($1, NOW())
       ON CONFLICT (email) DO UPDATE SET last_login_at = NOW()
       RETURNING id, email`,
      [email]
    );
    const user = userResult.rows[0];

    const sessionToken = randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

    await client.query(
      "INSERT INTO cscosmos_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, hashToken(sessionToken), sessionExpires]
    );

    await client.query("COMMIT");

    const store = await cookies();
    store.set(SESSION_COOKIE, sessionToken, cookieOptions(SESSION_DAYS * 24 * 60 * 60));

    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token && isDatabaseConfigured()) {
    try {
      await getPool().query("DELETE FROM cscosmos_sessions WHERE token_hash = $1", [
        hashToken(token),
      ]);
    } catch {
      // Ignore a missing schema on sign-out.
    }
  }

  store.delete(SESSION_COOKIE);
}

export function accountUrl(): string {
  return `${siteConfig.url}/login`;
}
