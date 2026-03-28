import { slugify } from "@/lib/utils";

export type ContentTag = {
  slug: string;
  /** Display name from the GitHub label */
  name: string;
};

const EXCLUDED_EXACT = new Set([
  "bug",
  "telegram-reported",
  "telegram-reported",
  "critical",
  "high",
  "medium",
  "low",
  "investigating",
  "documentation",
  "duplicate",
  "invalid",
  "wontfix"
]);

const EXCLUDED_PREFIXES = ["channel:", "reporter:", "reported-by:", "submitted-by:"];

export function tagsFromLabels(labels: string[]): ContentTag[] {
  const seen = new Set<string>();
  const out: ContentTag[] = [];

  for (const raw of labels) {
    const lower = raw.trim().toLowerCase();
    if (!lower || EXCLUDED_EXACT.has(lower)) {
      continue;
    }
    if (EXCLUDED_PREFIXES.some((p) => lower.startsWith(p))) {
      continue;
    }
    const slug = slugify(raw);
    if (!slug || seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    out.push({ slug, name: raw.trim() });
  }

  return out;
}
