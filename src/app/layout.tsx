import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import '@/index.css';

export const metadata: Metadata = {
  title: 'CSCosmos - Computer Science Learning Hub',
  description: 'Curated hub of interactive computer science visualizers and learning modules across Full Stack, DSA, Web3, Cybersecurity, AI, DevOps, and Core CS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="cscosmos-ui-theme">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
