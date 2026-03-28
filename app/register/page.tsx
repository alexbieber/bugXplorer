import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function RegisterPage() {
  return (
    <StaticProse title="Create an account">
      <p>
        Self-serve registration is not enabled yet. Identities on reports come from <strong>GitHub</strong>{" "}
        (issue author and labels). When we add accounts, sign-up will likely use GitHub OAuth to match your
        existing contributions.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
