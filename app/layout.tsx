import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "BugXplorer — Forensic bug reports",
  description: "Public bug reports from your community, powered by GitHub Issues."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const repoUrl = owner && repo ? `https://github.com/${owner}/${repo}` : "";
  const reportIssueHref = owner && repo ? `https://github.com/${owner}/${repo}/issues/new` : "#";

  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body>
        <AppShell reportIssueHref={reportIssueHref} repoUrl={repoUrl}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
