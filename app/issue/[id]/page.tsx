import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueBody } from "@/components/issue-body";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
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

  const backHref = issue.channelSlug ? `/channel/${issue.channelSlug}` : "/";

  return (
    <div className="issue-dashboard">
      <aside className="issue-sidebar">
        <h3>Report</h3>
        <div className="issue-sidebar-badges">
          <IssueWorkflowBadge issue={issue} />
          <SeverityBadge severity={issue.severity} />
        </div>
        {issue.channelName ? (
          <div className="issue-sidebar-row">
            <strong>Channel</strong>
            <Link href={`/channel/${issue.channelSlug}`}>{issue.channelName}</Link>
          </div>
        ) : null}
        <div className="issue-sidebar-row">
          <strong>Reporter</strong>
          {issue.reporter}
        </div>
        <div className="issue-sidebar-row">
          <strong>Created</strong>
          {formatDate(issue.createdAt)}
        </div>
        <div className="issue-sidebar-row">
          <strong>GitHub</strong>
          <a href={issue.url} target="_blank" rel="noreferrer">
            View issue #{issue.number}
          </a>
        </div>
      </aside>

      <div className="issue-main">
        <Link className="back-link" href={backHref}>
          ← Back to feed
        </Link>

        <p className="issue-breadcrumb">
          <Link href="/">Archive</Link>
          {issue.channelName ? (
            <>
              {" "}
              / <Link href={`/channel/${issue.channelSlug}`}>{issue.channelName}</Link>
            </>
          ) : null}{" "}
          / <span>BX-{issue.number}</span>
        </p>

        <header className="article-header">
          <div className="article-meta-row">
            <IssueWorkflowBadge issue={issue} />
            <SeverityBadge severity={issue.severity} />
            {issue.channelName ? (
              <Link className="pill-link" href={`/channel/${issue.channelSlug}`}>
                {issue.channelName}
              </Link>
            ) : null}
          </div>

          <h1>{issue.title}</h1>

          <div className="article-meta">
            <span>{issue.reporter}</span>
            <span>·</span>
            <time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
            <span>·</span>
            <a href={issue.url} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </header>

        <IssueBody issue={issue} />
      </div>

      <aside className="issue-aside">
        <h3>Quick actions</h3>
        <ul>
          <li>
            <a href={issue.url} target="_blank" rel="noreferrer">
              Open on GitHub
            </a>
          </li>
          <li>
            <a href={`${issue.url}#issuecomment-new`} target="_blank" rel="noreferrer">
              Comment on GitHub
            </a>
          </li>
        </ul>
        <div className="issue-aside-note">
          <strong>Discussion</strong>
          Comments and review happen on GitHub. This page is a read-only mirror of the issue body.
        </div>
      </aside>
    </div>
  );
}
