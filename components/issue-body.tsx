import { MarkdownBody } from "@/components/markdown-body";
import { BugIssue } from "@/lib/types";

export function IssueBody({ issue }: { issue: BugIssue }) {
  return (
    <div className="article-body article-body-markdown">
      <MarkdownBody markdown={issue.body} />
    </div>
  );
}
