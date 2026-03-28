import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueBody } from "@/components/issue-body";
import { SeverityBadge } from "@/components/severity-badge";
import { getFeedData } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export default async function IssuePage({
  params
}: {
  params: { id: string };
}) {
  const data = await getFeedData();
  const issue = data.issues.find((item) => item.number.toString() === params.id);

  if (!issue) {
    notFound();
  }

  return (
    <article className="article-page">
      <Link className="back-link" href={issue.channelSlug ? `/channel/${issue.channelSlug}` : "/"}>
        Back to feed
      </Link>

      <header className="article-header">
        <div className="article-meta-row">
          <SeverityBadge severity={issue.severity} />
          {issue.channelName ? (
            <Link className="pill-link" href={`/channel/${issue.channelSlug}`}>
              {issue.channelName}
            </Link>
          ) : null}
        </div>

        <h1>{issue.title}</h1>

        <div className="article-meta">
          <span>Reported by {issue.reporter}</span>
          <span>{formatDate(issue.createdAt)}</span>
          <a href={issue.url} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
      </header>

      <IssueBody issue={issue} />
    </article>
  );
}
