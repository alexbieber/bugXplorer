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
  repoUrl: string;
}) {
  const pathname = usePathname();

  type NavItem = { href: string; label: string; external?: boolean; match?: "prefix" };
  const nav: NavItem[] = [
    { href: "/", label: "Feed" },
    { href: "/search", label: "Search" },
    { href: "/tags", label: "Topics", match: "prefix" },
    { href: "/write", label: "Write" },
    { href: "/about", label: "About" }
  ];
  if (repoUrl) {
    nav.push({ href: repoUrl, label: "Repository", external: true });
  }

  const isActive = (item: NavItem) => {
    if (item.external) {
      return false;
    }
    if (item.match === "prefix") {
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }
    return item.href.split("#")[0] === pathname;
  };

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
            const active = isActive(item);
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

        <div className="sidebar-auth">
          <Link className="sidebar-link sidebar-link-muted" href="/login">
            Log in
          </Link>
          <Link className="sidebar-link sidebar-link-muted" href="/register">
            Register
          </Link>
          <Link className="sidebar-link sidebar-link-muted" href="/dashboard">
            My posts
          </Link>
          <Link className="sidebar-link sidebar-link-muted" href="/settings">
            Settings
          </Link>
        </div>

        <a
          className="sidebar-cta"
          href={reportIssueHref}
          {...(reportIssueHref === "#" ? {} : { target: "_blank", rel: "noreferrer" })}
        >
          New report
        </a>

        <div className="sidebar-footer">
          <div className="sidebar-footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <span>BugXplorer</span>
        </div>
      </aside>

      <div className="dashboard-column">
        <header className="dashboard-topbar">
          <nav className="topbar-tabs" aria-label="Section">
            <Link className={`topbar-tab${pathname === "/" ? " topbar-tab-active" : ""}`} href="/">
              Explore
            </Link>
            <Link className={`topbar-tab${pathname.startsWith("/search") ? " topbar-tab-active" : ""}`} href="/search">
              Search
            </Link>
            <Link
              className={`topbar-tab${pathname.startsWith("/tags") ? " topbar-tab-active" : ""}`}
              href="/tags"
            >
              Topics
            </Link>
            <span className="topbar-tab muted">Insights</span>
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
