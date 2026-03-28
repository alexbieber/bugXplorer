import { FeedClient } from "@/components/feed-client";
import { BugIssue, ChannelOption } from "@/lib/types";

export function FeedPage({
  issues,
  channels,
  title,
  description,
  activeChannel
}: {
  issues: BugIssue[];
  channels: ChannelOption[];
  title: string;
  description: string;
  activeChannel?: string;
}) {
  const featured = issues[0];

  return (
    <div className="feed-layout">
      <section className="hero">
        <p className="eyebrow">Public Bug Report Site</p>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
        <div className="hero-note">
          <span>Telegram group</span>
          <span>GitHub Issues</span>
          <span>BugFeed</span>
          <span>Public site</span>
        </div>
      </section>

      {featured ? (
        <section className="featured-card">
          <div>
            <p className="featured-label">Most recent report</p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
          </div>
          <div className="featured-meta">
            <span>{featured.channelName || "General"}</span>
            <span>{featured.severity}</span>
            <span>{featured.reporter}</span>
          </div>
        </section>
      ) : null}

      <FeedClient
        issues={issues}
        channels={channels}
        activeChannel={activeChannel}
      />
    </div>
  );
}
