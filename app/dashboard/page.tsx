import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function DashboardPage() {
  return (
    <StaticProse title="My posts">
      <p>
        A personal dashboard for drafts and published posts needs authentication and a database. Today, use{" "}
        <a href="https://github.com/issues" rel="noreferrer" target="_blank">
          GitHub Issues
        </a>{" "}
        (filtered by author) to manage your reports.
      </p>
      <h2>Draft preview</h2>
      <p>
        Draft previews will be available once in-app authoring is added. For now, use GitHub issue drafts or
        private issues in your repo.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
