import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function TermsPage() {
  return (
    <StaticProse title="Terms of Service">
      <p>
        BugXplorer is provided as-is for displaying GitHub issue content. You are responsible for compliance
        with GitHub&apos;s Terms of Service and for the accuracy of reports. No warranty is made.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
