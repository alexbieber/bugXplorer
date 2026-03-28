"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const timelineMark: Record<string, string> = {
  critical: "⚠",
  high: "↑",
  medium: "◆",
  low: "○"
};

export function FeedClient({
  issues,
  channels,
  activeChannel,
  githubConfigured = true,
  leadIssueId
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  activeChannel?: string;
  githubConfigured?: boolean;
  leadIssueId?: number;
}) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState(activeChannel ?? "all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesChannel = channel === "all" || issue.channelSlug === channel;
      const haystack = [issue.title, issue.body, issue.reporter, issue.channelName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);

      return matchesChannel && matchesQuery;
    });
  }, [channel, issues, query]);

  const listIssues = useMemo(() => {
    const searching = query.trim().length > 0;
    const channelFiltered = channel !== "all";
    if (leadIssueId != null && !searching && !channelFiltered) {
      return filtered.filter((issue) => issue.id !== leadIssueId);
    }
    return filtered;
  }, [filtered, leadIssueId, query, channel]);

  return (
    <section className="feed-section">
      <div className="forensic-log-header" id="forensic-log">
        <h2 className="forensic-log-title">Forensic log</h2>
      </div>

      <div className="toolbar">
        <input
          aria-label="Search bug reports"
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter reports…"
          value={query}
        />

        <select
          aria-label="Filter by channel"
          className="channel-select"
          onChange={(event) => setChannel(event.target.value)}
          value={channel}
        >
          <option value="all">All channels</option>
          {channels.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {listIssues.length > 0 ? (
        <div className="results-header">
          <p>
            {listIssues.length}
            {leadIssueId != null ? " more " : " "}
            entr{listIssues.length === 1 ? "y" : "ies"}
          </p>
          {channel !== "all" ? (
            <Link className="subtle-link" href={channel === activeChannel ? "/" : `/channel/${channel}`}>
              {channel === activeChannel ? "View all" : "Open channel"}
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="feed-list">
        {listIssues.map((issue) => (
          <article className="feed-story" data-severity={issue.severity} key={issue.id}>
            <div className="feed-story-timeline" aria-hidden title={issue.severity}>
              {timelineMark[issue.severity] ?? "◆"}
            </div>
            <div className="feed-story-body">
              <div className="feed-story-meta">
                <IssueWorkflowBadge issue={issue} />
                <span>{issue.channelName || "General"}</span>
                <span className="dot">·</span>
                <time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
              </div>
              <Link className="feed-story-link" href={`/issue/${issue.number}`}>
                <h2 className="feed-story-title">{issue.title}</h2>
              </Link>
              <p className="feed-story-excerpt">{issue.excerpt}</p>
              <div className="feed-story-footer">
                <SeverityBadge severity={issue.severity} />
                <span>{issue.reporter}</span>
                <a className="gh-link" href={issue.url} target="_blank" rel="noreferrer">
                  Open on GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length ? (
        <div className="empty-state">
          {!githubConfigured ? (
            <>
              <p className="eyebrow">Configuration</p>
              <h2>Connect a GitHub repository</h2>
              <p className="setup-hint">
                Add <code>GITHUB_OWNER</code>, <code>GITHUB_REPO</code>, and (for private repos){" "}
                <code>GITHUB_TOKEN</code> to <code>.env.local</code> (see <code>.env.local.example</code>),
                then restart the dev server or redeploy.
              </p>
            </>
          ) : issues.length === 0 ? (
            <>
              <p className="eyebrow">No reports</p>
              <h2>No issues are showing yet</h2>
              <p className="setup-hint">
                The site reads from the repo set in <code>GITHUB_OWNER</code> / <code>GITHUB_REPO</code>.
                Confirm that repo has <strong>Issues</strong> enabled and at least one issue (open or
                closed). If your bot posts to a <em>different</em> repository, point the env vars there.
                If you set <code>BUGFEED_REQUIRED_LABELS</code>, each issue needs one of those labels.
                To show only open items, set <code>GITHUB_ISSUE_STATE=open</code>.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">No matches</p>
              <h2>No stories match your filters.</h2>
              <p>Try another search or switch back to all channels.</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
