import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function AboutPage() {
  return (
    <StaticProse title="About BugXplorer">
      <p>
        BugXplorer is a <strong>public-facing layer</strong> on top of GitHub Issues: a forensic-style feed for
        security and product bug reports, with topics, search, and readable article pages—without exposing
        private Telegram channels.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
