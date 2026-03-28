"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeedClient({
  issues,
  channels,
  activeChannel,
  githubConfigured = true
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  activeChannel?: string;
  githubConfigured?: boolean;
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

  return (
    <section className="feed-section">
      <div className="toolbar">
        <input
          aria-label="Search bug reports"
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reports, channels, or reporters"
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

      <div className="results-header">
        <p>{filtered.length} report{filtered.length === 1 ? "" : "s"}</p>
        {channel !== "all" ? (
          <Link className="subtle-link" href={channel === activeChannel ? "/" : `/channel/${channel}`}>
            {channel === activeChannel ? "View all reports" : "Open channel page"}
          </Link>
        ) : null}
      </div>

      <div className="feed-list">
        {filtered.map((issue) => (
          <article className="issue-card" key={issue.id}>
            <div className="issue-card-meta">
              <span>{issue.channelName || "General"}</span>
              <span>{formatDate(issue.createdAt)}</span>
            </div>
            <Link className="issue-card-link" href={`/issue/${issue.number}`}>
              <h2>{issue.title}</h2>
            </Link>
            <p>{issue.excerpt}</p>
            <div className="issue-card-footer">
              <SeverityBadge severity={issue.severity} />
              <span>By {issue.reporter}</span>
              <a href={issue.url} target="_blank" rel="noreferrer">
                GitHub
              </a>
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
              <h2>No bug reports match your filters.</h2>
              <p>Try a different keyword or switch back to all channels.</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
