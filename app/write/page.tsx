import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function WritePage() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const newIssueUrl = owner && repo ? `https://github.com/${owner}/${repo}/issues/new` : null;

  return (
    <StaticProse title="Submit a report">
      <p>
        BugXplorer mirrors <strong>GitHub Issues</strong>. New bug reports and resources are created on GitHub
        (e.g. via your Telegram bot or the button below). A rich-text editor with drafts and in-app publishing
        would require a backend—we can add that later.
      </p>
      <h2>Submit via GitHub</h2>
      <p>
        {newIssueUrl ? (
          <a className="static-prose-cta" href={newIssueUrl} rel="noreferrer" target="_blank">
            Open new issue on GitHub →
          </a>
        ) : (
          <span>Set <code>GITHUB_OWNER</code> and <code>GITHUB_REPO</code> to enable this link.</span>
        )}
      </p>
      <h2>Recommended labels</h2>
      <p>
        Use labels for <strong>channel:</strong>, <strong>severity</strong> (critical/high/medium/low), optional{" "}
        <strong>investigating</strong>, and topic tags like <code>python</code> or <code>react</code> so they
        appear in search and topic pages.
      </p>
      <p>
        <Link href="/">← Back to feed</Link>
      </p>
    </StaticProse>
  );
}
