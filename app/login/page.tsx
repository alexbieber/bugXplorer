import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function LoginPage() {
  return (
    <StaticProse title="Log in">
      <p>
        BugXplorer is currently <strong>read-only</strong> and uses public GitHub data. Session-based login,
        followers, and in-app profiles are planned for a future release (e.g. NextAuth + GitHub OAuth).
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
