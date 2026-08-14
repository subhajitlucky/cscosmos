import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GolangViz | Visual Go Learning Platform",
  description:
    "Interactive, visual-first Golang learning platform with memory, concurrency, and compiler walkthroughs.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "GolangViz | Visual Go Learning Platform",
    description:
      "Visual explanations of Go memory, goroutines, channels, compiler pipeline, and more.",
    siteName: "GolangViz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GolangViz | Visual Go Learning Platform",
    description:
      "Visual explanations of Go memory, goroutines, channels, compiler pipeline, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInit = `
    try {
      const stored = localStorage.getItem("golangviz-theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  `;

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
