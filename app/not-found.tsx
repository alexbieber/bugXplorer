import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="eyebrow">404</p>
      <h1>Nothing published here yet.</h1>
      <p>This page may refer to a channel or issue that has not been indexed from GitHub.</p>
      <Link className="primary-link" href="/">
        Return to the feed
      </Link>
    </div>
  );
}
