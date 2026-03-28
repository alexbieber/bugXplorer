"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption, TagOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const timelineMark: Record<string, string> = {
  critical: "⚠",
  high: "↑",
  medium: "◆",
  low: "○"
};

type SortMode = "latest" | "trending";

export function FeedClient({
  issues,
  channels,
  tags,
  activeChannel,
  githubConfigured = true,
  leadIssueId
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  tags: TagOption[];
  activeChannel?: string;
  githubConfigured?: boolean;
  leadIssueId?: number;
}) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState(activeChannel ?? "all");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [tagSlug, setTagSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesChannel = channel === "all" || issue.channelSlug === channel;
      const matchesTag =
        !tagSlug || issue.tags.some((t) => t.slug.toLowerCase() === tagSlug.toLowerCase());
      const haystack = [issue.title, issue.body, issue.reporter, issue.channelName, ...issue.tags.map((t) => t.name)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);

      return matchesChannel && matchesTag && matchesQuery;
    });
  }, [channel, issues, query, tagSlug]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortMode === "trending") {
      copy.sort((a, b) => {
        const c = b.commentCount - a.commentCount;
        if (c !== 0) {
          return c;
        }
        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      });
    } else {
      copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return copy;
  }, [filtered, sortMode]);

  const listIssues = useMemo(() => {
    const searching = query.trim().length > 0;
    const channelFiltered = channel !== "all";
    const tagFiltered = tagSlug !== null;
    if (leadIssueId != null && !searching && !channelFiltered && !tagFiltered) {
      return sorted.filter((issue) => issue.id !== leadIssueId);
    }
    return sorted;
  }, [sorted, leadIssueId, query, channel, tagSlug]);

  return (
    <section className="feed-section">
      <div className="forensic-log-header" id="forensic-log">
        <h2 className="forensic-log-title">Forensic log</h2>
      </div>

      <div className="feed-filters">
        <div className="feed-sort" role="group" aria-label="Sort reports">
          <button
            className={`feed-sort-btn${sortMode === "latest" ? " feed-sort-btn-active" : ""}`}
            type="button"
            onClick={() => setSortMode("latest")}
          >
            Latest
          </button>
          <button
            className={`feed-sort-btn${sortMode === "trending" ? " feed-sort-btn-active" : ""}`}
            type="button"
            onClick={() => setSortMode("trending")}
          >
            Trending
          </button>
        </div>
        {tags.length > 0 ? (
          <div className="feed-tag-row">
            <span className="feed-tag-label">Tags</span>
            <div className="feed-tag-chips">
              <button
                className={`feed-tag-chip${tagSlug === null ? " feed-tag-chip-active" : ""}`}
                type="button"
                onClick={() => setTagSlug(null)}
              >
                All
              </button>
              {tags.slice(0, 14).map((t) => (
                <button
                  key={t.slug}
                  className={`feed-tag-chip${tagSlug === t.slug ? " feed-tag-chip-active" : ""}`}
                  type="button"
                  onClick={() => setTagSlug(t.slug === tagSlug ? null : t.slug)}
                >
                  {t.name}
                  <span className="feed-tag-count">{t.count}</span>
                </button>
              ))}
              <Link className="feed-tag-browse" href="/tags">
                All topics →
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className="toolbar">
        <input
          aria-label="Search bug reports"
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by keyword, technology, reporter…"
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
                {issue.commentCount > 0 ? (
                  <>
                    <span className="dot">·</span>
                    <span>{issue.commentCount} comments</span>
                  </>
                ) : null}
              </div>
              <Link className="feed-story-link" href={`/issue/${issue.number}`}>
                <h2 className="feed-story-title">{issue.title}</h2>
              </Link>
              <p className="feed-story-excerpt">{issue.excerpt}</p>
              {issue.tags.length > 0 ? (
                <div className="feed-story-tags">
                  {issue.tags.map((t) => (
                    <Link className="feed-story-tag" href={`/tags/${t.slug}`} key={t.slug}>
                      #{t.name}
                    </Link>
                  ))}
                </div>
              ) : null}
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
              <p>Try another search, tag, or switch back to all channels.</p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
