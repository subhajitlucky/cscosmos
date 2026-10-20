import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, comments: [] });
  }

  const { slug } = await params;
  const result = await getPool().query<{
    id: string;
    body: string;
    email: string;
    created_at: string;
  }>(
    `SELECT c.id, c.body, u.email, c.created_at
     FROM cscosmos_comments c
     JOIN cscosmos_users u ON u.id = c.user_id
     WHERE c.topic_slug = $1 AND c.hidden = FALSE
     ORDER BY c.created_at DESC
     LIMIT 50`,
    [slug]
  );

  return NextResponse.json({
    ok: true,
    comments: result.rows.map((row) => ({
      id: row.id,
      body: row.body,
      author: maskEmail(row.email),
      createdAt: row.created_at,
    })),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Comments are not configured." }, { status: 503 });
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to comment." }, { status: 401 });
  }

  const { slug } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const text = typeof (body as { body?: unknown }).body === "string"
    ? (body as { body: string }).body.trim()
    : "";

  if (text.length < 2 || text.length > 4000) {
    return NextResponse.json(
      { ok: false, error: "Comment must be between 2 and 4,000 characters." },
      { status: 400 }
    );
  }

  const recent = await getPool().query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM cscosmos_comments
     WHERE user_id = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
    [user.id]
  );

  if (Number(recent.rows[0]?.count ?? 0) >= 5) {
    return NextResponse.json(
      { ok: false, error: "You are commenting too quickly. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const id = randomUUID();
  await getPool().query(
    "INSERT INTO cscosmos_comments (id, topic_slug, user_id, body) VALUES ($1, $2, $3, $4)",
    [id, slug, user.id, text]
  );

  return NextResponse.json({ ok: true, id });
}
