import Link from "next/link";
import { StaticProse } from "@/components/static-prose";

export default function ContactPage() {
  return (
    <StaticProse title="Contact">
      <p>
        For bug reports about the platform itself, open an issue in the project repository. For everything else,
        use the contact channels your team maintains outside this app.
      </p>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </StaticProse>
  );
}
