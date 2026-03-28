import { BugIssue } from "@/lib/types";

function hasInvestigatingLabel(labels: string[]) {
  return labels.some((l) => l.includes("investigating"));
}

export function IssueWorkflowBadge({ issue }: { issue: Pick<BugIssue, "state" | "labels"> }) {
  const investigating = hasInvestigatingLabel(issue.labels);
  if (issue.state === "closed") {
    return <span className="workflow-badge workflow-resolved">Resolved</span>;
  }
  if (investigating) {
    return <span className="workflow-badge workflow-investigating">Investigating</span>;
  }
  return <span className="workflow-badge workflow-open">Open</span>;
}
