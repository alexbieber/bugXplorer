import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function SettingsPage() {
  return (
    <StaticProse title="Settings">
      <p>
        Avatar, bio, notifications, and password change require a <strong>logged-in account</strong>, which is
        not wired up in this GitHub-only build. Configure the site via your deployment environment (e.g.{" "}
        <code>GITHUB_*</code> on Vercel).
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
