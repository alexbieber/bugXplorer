import { BugIssue } from "@/lib/types";

export function MetricsStrip({ issues }: { issues: BugIssue[] }) {
  const total = issues.length;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const closed = issues.filter((i) => i.state === "closed").length;
  const open = issues.filter((i) => i.state === "open").length;
  const resolutionPct = total > 0 ? Math.round((closed / total) * 1000) / 10 : 0;

  const items = [
    { label: "Total reports", value: total.toLocaleString() },
    { label: "Resolution rate", value: `${resolutionPct}%` },
    { label: "Critical", value: critical.toLocaleString() },
    { label: "Open", value: open.toLocaleString() }
  ];

  return (
    <div className="metrics-strip">
      {items.map((item) => (
        <div className="metric-card" key={item.label}>
          <p className="metric-label">{item.label}</p>
          <p className="metric-value">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
