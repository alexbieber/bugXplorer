import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BugFeed",
  description: "Public bug reports from your community, powered by GitHub Issues."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark">B</span>
              <span>
                <strong>BugFeed</strong>
                <span className="brand-subtitle">Community-reported product bugs</span>
              </span>
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
