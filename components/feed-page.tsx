import Link from "next/link";
import { FeedClient } from "@/components/feed-client";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
import { MetricsStrip } from "@/components/metrics-strip";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeedPage({
  issues,
  channels,
  title,
  description,
  activeChannel,
  githubConfigured = true
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  title: string;
  description: string;
  activeChannel?: string;
  githubConfigured?: boolean;
}) {
  const featured = issues[0];

  return (
    <div className="feed-layout">
      <section className="hero">
        <p className="eyebrow">BugXplorer</p>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
      </section>

      {githubConfigured && issues.length > 0 ? <MetricsStrip issues={issues} /> : null}

      {featured ? (
        <section className="featured-story">
          <Link className="featured-story-inner" href={`/issue/${featured.number}`}>
            <p className="featured-kicker">Latest</p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="featured-meta">
              <IssueWorkflowBadge issue={featured} />
              <SeverityBadge severity={featured.severity} />
              <span>{featured.channelName || "General"}</span>
              <span className="meta-sep">·</span>
              <time dateTime={featured.createdAt}>{formatDate(featured.createdAt)}</time>
              <span className="meta-sep">·</span>
              <span>{featured.reporter}</span>
            </div>
          </Link>
        </section>
      ) : null}

      <FeedClient
        githubConfigured={githubConfigured}
        issues={issues}
        channels={channels}
        activeChannel={activeChannel}
        leadIssueId={featured?.id}
      />
    </div>
  );
}
