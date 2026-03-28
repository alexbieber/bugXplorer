import { FeedClient } from "@/components/feed-client";
import { MetricsStrip } from "@/components/metrics-strip";
import { buildTagOptions, getFeedData } from "@/lib/github";
import type { BugIssue } from "@/lib/types";

export const revalidate = 60;

export default async function SearchPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getFeedData();
  const q = typeof searchParams.q === "string" ? searchParams.q.toLowerCase() : "";
  const severity =
    typeof searchParams.severity === "string" ? searchParams.severity.toLowerCase() : "";
  const tag = typeof searchParams.tag === "string" ? searchParams.tag.toLowerCase() : "";

  let issues = data.issues;

  if (q) {
    issues = issues.filter((i) =>
      [i.title, i.body, i.reporter, i.authorLogin, ...i.tags.map((t) => t.name)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  if (severity && ["critical", "high", "medium", "low"].includes(severity)) {
    issues = issues.filter((i) => i.severity === severity as BugIssue["severity"]);
  }

  if (tag) {
    issues = issues.filter((i) => i.tags.some((t) => t.slug === tag));
  }

  const tags = buildTagOptions(issues);

  return (
    <div className="feed-layout">
      <section className="hero">
        <p className="eyebrow">Search</p>
        <h1>Find reports</h1>
        <p className="hero-copy">Filter by keyword, severity, or topic. Results come from your connected GitHub repository.</p>

        <form className="search-page-form" action="/search" method="get">
          <input
            className="search-input search-page-q"
            defaultValue={typeof searchParams.q === "string" ? searchParams.q : ""}
            name="q"
            placeholder="Keywords, technology, reporter…"
            type="search"
          />
          <select
            className="channel-select"
            defaultValue={severity}
            name="severity"
            aria-label="Severity"
          >
            <option value="">Any severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="channel-select" defaultValue={tag} name="tag" aria-label="Topic tag">
            <option value="">Any topic</option>
            {data.tags.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>
          <button className="search-page-submit" type="submit">
            Search
          </button>
        </form>
      </section>

      {data.githubConfigured && issues.length > 0 ? <MetricsStrip issues={issues} /> : null}

      <FeedClient
        channels={data.channels}
        githubConfigured={data.githubConfigured}
        issues={issues}
        tags={tags}
      />
    </div>
  );
}
