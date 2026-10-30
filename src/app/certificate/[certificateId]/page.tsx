import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, ShieldCheck } from "lucide-react";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Certificate - CSCosmos",
  description: "A public CSCosmos learning certificate.",
};

export const dynamic = "force-dynamic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function maskedEmail(email: string): string {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;

  if (!UUID_REGEX.test(certificateId) || !isDatabaseConfigured()) {
    notFound();
  }

  let certificate: {
    id: string;
    title: string;
    completed_count: number;
    issued_at: string;
    email: string;
  } | undefined;

  try {
    const result = await getPool().query<{
      id: string;
      title: string;
      completed_count: number;
      issued_at: string;
      email: string;
    }>(
      `SELECT c.id, c.title, c.completed_count, c.issued_at, u.email
       FROM cscosmos_certificates c
       JOIN cscosmos_users u ON u.id = c.user_id
       WHERE c.id = $1`,
      [certificateId]
    );
    certificate = result.rows[0];
  } catch {
    notFound();
  }

  if (!certificate) notFound();

  const issued = new Date(certificate.issued_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-12 print:py-0">
      <div className="page-container max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href="/progress" className="text-sm text-muted-foreground hover:text-foreground">
            Back to progress
          </Link>
          <PrintButton />
        </div>

        <article className="relative overflow-hidden rounded-2xl border-2 border-foreground/80 bg-card p-8 sm:p-14 print:border-black print:bg-white print:text-black">
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-border print:border-neutral-300" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground print:text-neutral-500">
              <Award className="h-4 w-4" aria-hidden="true" />
              CSCosmos Learning Certificate
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight text-foreground print:text-black sm:text-5xl">
              {certificate.title}
            </h1>

            <p className="mt-6 text-sm text-muted-foreground print:text-neutral-600">
              Issued to
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground print:text-black">
              {maskedEmail(certificate.email)}
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground print:text-neutral-700">
              For completing {certificate.completed_count} curated CSCosmos learning modules
              across computer science domains. This certificate verifies completion recorded
              by the learner account, not a proctored exam.
            </p>

            <div className="mt-10 grid gap-6 border-t border-border pt-5 text-xs sm:grid-cols-2 print:border-neutral-300">
              <div>
                <p className="font-mono uppercase tracking-[0.16em] text-muted-foreground print:text-neutral-500">
                  Issued
                </p>
                <p className="mt-1 font-medium text-foreground print:text-black">{issued}</p>
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.16em] text-muted-foreground print:text-neutral-500">
                  Verification ID
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-foreground print:text-black">
                  {certificate.id}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] text-muted-foreground print:text-neutral-500">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verify at cscosmos.vercel.app/certificate/{certificate.id}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
