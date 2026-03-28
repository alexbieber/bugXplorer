import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueBody } from "@/components/issue-body";
import { IssueComments } from "@/components/issue-comments";
import { IssueWorkflowBadge } from "@/components/issue-workflow-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { getFeedData, getIssueComments } from "@/lib/github";

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

  const comments = await getIssueComments(issue.number);
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
          <Link href={`/u/${encodeURIComponent(issue.authorLogin)}`}>{issue.reporter}</Link>
        </div>
        <div className="issue-sidebar-row">
          <strong>Created</strong>
          {new Date(issue.createdAt).toLocaleString()}
        </div>
        <div className="issue-sidebar-row">
          <strong>Updated</strong>
          {new Date(issue.updatedAt).toLocaleString()}
        </div>
        {issue.tags.length > 0 ? (
          <div className="issue-sidebar-row">
            <strong>Topics</strong>
            <div className="issue-sidebar-tags">
              {issue.tags.map((t) => (
                <Link href={`/tags/${t.slug}`} key={t.slug}>
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="issue-sidebar-row">
          <strong>GitHub</strong>
          <a href={issue.url} rel="noreferrer" target="_blank">
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
            <Link href={`/u/${encodeURIComponent(issue.authorLogin)}`}>{issue.reporter}</Link>
            <span>·</span>
            <time dateTime={issue.createdAt}>{new Date(issue.createdAt).toLocaleDateString()}</time>
            <span>·</span>
            <span>{issue.commentCount} comments</span>
            <span>·</span>
            <a href={issue.url} rel="noreferrer" target="_blank">
              View on GitHub
            </a>
          </div>
        </header>

        <IssueBody issue={issue} />
        <IssueComments comments={comments} />
      </div>

      <aside className="issue-aside">
        <h3>Quick actions</h3>
        <ul>
          <li>
            <a href={issue.url} rel="noreferrer" target="_blank">
              Open on GitHub
            </a>
          </li>
          <li>
            <a href={`${issue.url}#issuecomment-new`} rel="noreferrer" target="_blank">
              Comment on GitHub
            </a>
          </li>
          <li>
            <Link href="/write">Submit another report</Link>
          </li>
        </ul>
        <div className="issue-aside-note">
          <strong>Discussion</strong>
          Comments sync from GitHub. Post replies there — they appear here after the next refresh (up to ~60s).
        </div>
      </aside>
    </div>
  );
}
