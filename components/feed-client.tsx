"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeedClient({
  issues,
  channels,
  activeChannel
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  activeChannel?: string;
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
          <p className="eyebrow">No matches</p>
          <h2>No bug reports match your filters.</h2>
          <p>Try a different keyword or switch back to all channels.</p>
        </div>
      ) : null}
    </section>
  );
}
