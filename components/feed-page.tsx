import Link from "next/link";
import { FeedClient } from "@/components/feed-client";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
import { MetricsStrip } from "@/components/metrics-strip";
import { SeverityBadge } from "@/components/severity-badge";
import { BugIssue, ChannelOption, TagOption } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeedPage({
  issues,
  channels,
  tags,
  title,
  description,
  activeChannel,
  githubConfigured = true,
  showFeatured = true
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  tags: TagOption[];
  title: string;
  description: string;
  activeChannel?: string;
  githubConfigured?: boolean;
  /** When false, no “Latest” hero card (e.g. search / tag listing). */
  showFeatured?: boolean;
}) {
  const featured = showFeatured ? issues[0] : undefined;

  return (
    <div className="feed-layout">
      <section className="hero">
        <p className="eyebrow">BugXplorer</p>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
        <p className="hero-links">
          <Link href="/search">Search</Link>
          <span className="hero-links-sep">·</span>
          <Link href="/tags">Topics</Link>
          <span className="hero-links-sep">·</span>
          <Link href="/write">Submit a report</Link>
        </p>
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
        activeChannel={activeChannel}
        channels={channels}
        githubConfigured={githubConfigured}
        issues={issues}
        leadIssueId={showFeatured ? featured?.id : undefined}
        tags={tags}
      />
    </div>
  );
}
