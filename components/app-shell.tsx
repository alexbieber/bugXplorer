"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppShell({
  children,
  reportIssueHref,
  repoUrl
}: {
  children: React.ReactNode;
  reportIssueHref: string;
  /** Public GitHub repo URL for the issues source, or empty to hide. */
  repoUrl: string;
}) {
  const pathname = usePathname();

  type NavItem = { href: string; label: string; external?: boolean };
  const nav: NavItem[] = [
    { href: "/", label: "Overview" },
    { href: "/#forensic-log", label: "Forensic log" }
  ];
  if (repoUrl) {
    nav.push({ href: repoUrl, label: "Repository", external: true });
  }

  return (
    <div className="app-root">
      <aside className="sidebar" aria-label="Main navigation">
        <Link className="sidebar-logo" href="/">
          BugXplorer
        </Link>
        <div className="sidebar-project">
          <span className="sidebar-project-name">Community audit</span>
          <span className="sidebar-project-tag">GitHub issues</span>
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) => {
            const external = Boolean(item.external);
            const active = !external && item.href.split("#")[0] === pathname;
            return (
              <Link
                key={item.label}
                className={`sidebar-link${active ? " sidebar-link-active" : ""}`}
                href={item.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          className="sidebar-cta"
          href={reportIssueHref}
          {...(reportIssueHref === "#" ? {} : { target: "_blank", rel: "noreferrer" })}
        >
          New report
        </a>

        <div className="sidebar-footer">
          <span>BugXplorer</span>
        </div>
      </aside>

      <div className="dashboard-column">
        <header className="dashboard-topbar">
          <nav className="topbar-tabs" aria-label="Section">
            <span className="topbar-tab topbar-tab-active">Explore</span>
            <span className="topbar-tab muted">Insights</span>
            <span className="topbar-tab muted">Archive</span>
          </nav>
          <div className="topbar-actions">
            <a
              className="btn-report"
              href={reportIssueHref}
              {...(reportIssueHref === "#" ? {} : { target: "_blank", rel: "noreferrer" })}
            >
              Report a bug
            </a>
          </div>
        </header>

        <div className="dashboard-scroll">{children}</div>
      </div>
    </div>
  );
}
