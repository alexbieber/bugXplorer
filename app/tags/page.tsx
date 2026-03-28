import Link from "next/link";
import { getFeedData } from "@/lib/github";

export const revalidate = 60;

export default async function TagsPage() {
  const data = await getFeedData();

  return (
    <div className="feed-layout">
      <section className="hero">
        <p className="eyebrow">Discovery</p>
        <h1>Topics</h1>
        <p className="hero-copy">
          Tags are derived from GitHub issue labels (excluding channel, severity, and system labels).
        </p>
      </section>

      {!data.githubConfigured ? (
        <div className="empty-state">
          <p className="eyebrow">Configuration</p>
          <h2>Connect GitHub first</h2>
          <p>Configure <code>GITHUB_OWNER</code> and <code>GITHUB_REPO</code> to load topics.</p>
        </div>
      ) : data.tags.length === 0 ? (
        <div className="empty-state">
          <h2>No topics yet</h2>
          <p>Add labels to issues in your repository to see them here.</p>
        </div>
      ) : (
        <ul className="tags-directory">
          {data.tags.map((t) => (
            <li key={t.slug}>
              <Link className="tags-directory-link" href={`/tags/${t.slug}`}>
                <span className="tags-directory-name">#{t.name}</span>
                <span className="tags-directory-count">{t.count} reports</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
