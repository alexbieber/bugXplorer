export function StaticProse({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="feed-layout static-prose">
      <h1 className="static-prose-title">{title}</h1>
      <div className="static-prose-body">{children}</div>
    </div>
  );
}
