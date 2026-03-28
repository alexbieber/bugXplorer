import Image from "next/image";
import { MarkdownBody } from "@/components/markdown-body";
import type { IssueComment } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function IssueComments({ comments }: { comments: IssueComment[] }) {
  if (!comments.length) {
    return (
      <section className="issue-comments">
        <h2 className="issue-comments-title">Discussion</h2>
        <p className="issue-comments-empty">No comments yet. Continue the thread on GitHub.</p>
      </section>
    );
  }

  return (
    <section className="issue-comments">
      <h2 className="issue-comments-title">Discussion ({comments.length})</h2>
      <ul className="issue-comments-list">
        {comments.map((comment) => (
          <li className="issue-comment-card" key={comment.id}>
            <div className="issue-comment-head">
              <Image
                alt=""
                className="issue-comment-avatar"
                height={36}
                src={comment.authorAvatarUrl}
                width={36}
              />
              <div>
                <span className="issue-comment-author">{comment.authorLogin}</span>
                <time className="issue-comment-time" dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <a className="issue-comment-link" href={comment.url} rel="noreferrer" target="_blank">
                View on GitHub
              </a>
            </div>
            <div className="issue-comment-body">
              <MarkdownBody markdown={comment.body} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
