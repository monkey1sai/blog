/** Actual tag overlap only; never infer a relationship from category or title. */
export interface RelatedItem {
  id: string;
  kind: 'projects' | 'blog';
  title: string;
  tags: readonly string[];
}
export function relatedByTags(current: Pick<RelatedItem, 'id' | 'kind' | 'tags'>, candidates: readonly RelatedItem[]): RelatedItem[] {
  const tags = new Set(current.tags);
  const seen = new Set<string>();
  return candidates.filter((item) => {
    const key = `${item.kind}/${item.id}`;
    if (key === `${current.kind}/${current.id}` || seen.has(key)) return false;
    seen.add(key);
    return item.tags.some((tag) => tags.has(tag));
  }).map((item) => ({ item, score: new Set(item.tags.filter((tag) => tags.has(tag))).size }))
    .sort((a, b) => b.score - a.score || `${a.item.kind}/${a.item.id}`.localeCompare(`${b.item.kind}/${b.item.id}`))
    .slice(0, 3).map(({ item }) => item);
}
