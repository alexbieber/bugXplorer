import Image from "next/image";
import { BugIssue } from "@/lib/types";

export function IssueBody({ issue }: { issue: BugIssue }) {
  return (
    <div className="article-body">
      {issue.screenshotUrls.length ? (
        <section className="screenshot-grid">
          {issue.screenshotUrls.map((src) => (
            <figure className="screenshot-frame" key={src}>
              <Image
                alt={`Screenshot for bug report ${issue.number}`}
                className="screenshot"
                height={720}
                src={src}
                width={1280}
              />
            </figure>
          ))}
        </section>
      ) : null}

      {issue.bodySections.length ? (
        issue.bodySections.map((section, index) => <p key={`${issue.id}-${index}`}>{section}</p>)
      ) : (
        <p>No issue description was provided.</p>
      )}
    </div>
  );
}
