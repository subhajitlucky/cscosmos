import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import '@/index.css';

export const metadata: Metadata = {
  title: 'CSCosmos - Computer Science Learning Hub',
  description: 'Curated hub of interactive computer science visualizers and learning modules across Full Stack, DSA, Web3, Cybersecurity, AI, DevOps, and Core CS.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

// Runs before first paint so the stored theme is applied without a flash.
// Keep in sync with src/context/ThemeContext.tsx.
const THEME_INIT_SCRIPT = `(function(){try{var k='cscosmos-ui-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'&&t!=='system'){t='dark';}if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.remove('light','dark');d.classList.add(t);d.setAttribute('data-theme',t);d.setAttribute('data-mode',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider defaultTheme="dark" storageKey="cscosmos-ui-theme">
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
