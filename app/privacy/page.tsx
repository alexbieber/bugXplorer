import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function PrivacyPage() {
  return (
    <StaticProse title="Privacy Policy">
      <p>
        This site displays data from <strong>public GitHub Issues</strong> in your configured repository. It
        does not store Telegram chat IDs in the browser. Do not paste secrets into issue bodies. Hosting
        providers (e.g. Vercel) may log requests as described in their privacy policies.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
