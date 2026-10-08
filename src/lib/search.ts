import { CATEGORIES, INDUSTRIES, USE_CASES } from "@/data/taxonomy";
import type { Service } from "@/types";

/**
 * Lightweight relevance search over the catalog.
 *
 * - Weighted fields: name > keywords > category > industry/use case > copy
 * - Every query term must match something (AND), so results narrow as you type
 * - Plural-insensitive ("cards" ↔ "card"), prefix-aware ("busi" → "business")
 * - Typo-tolerant for longer words ("buisness", "flyres")
 *
 * At catalog scale (tens to low thousands of items) this runs in well under
 * a millisecond per request. A larger catalog would move to a search engine
 * (Algolia, Meilisearch, Postgres FTS) behind the same `searchServices` API.
 */

const STOP_WORDS = new Set(["a", "an", "and", "the", "for", "of", "in", "on", "with", "my", "our", "to", "me"]);

const FIELD_WEIGHTS = {
  name: 10,
  keywords: 6,
  category: 5,
  facets: 3,
  summary: 2,
  description: 1,
} as const;

/** Lowercase, strip accents/punctuation and split into normalized terms. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t && !STOP_WORDS.has(t))
    .map(stem);
}

/** Minimal English plural folding — enough for catalog nouns. */
function stem(term: string): string {
  if (term.length > 4 && term.endsWith("ies")) return term.slice(0, -3) + "y";
  if (term.length > 4 && /(ches|shes|sses|xes)$/.test(term)) return term.slice(0, -2);
  if (term.length > 3 && term.endsWith("s") && !term.endsWith("ss")) return term.slice(0, -1);
  return term;
}

/**
 * Optimal string alignment distance (Levenshtein + adjacent transpositions,
 * so "flyres" → "flyer" is one edit), with an early exit past `max`.
 */
function withinEditDistance(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prevPrev: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        curr[j] = Math.min(curr[j], prevPrev[j - 2] + 1);
      }
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > max) return false;
    prevPrev = prev;
    prev = curr;
  }
  return prev[b.length] <= max;
}

type IndexedService = { service: Service; terms: Map<string, number>; name: string };

const categoryLabel = new Map(CATEGORIES.map((c) => [c.slug, `${c.label} ${c.tagline}`]));
const industryLabel = new Map(INDUSTRIES.map((i) => [i.slug, i.label]));
const useCaseLabel = new Map(USE_CASES.map((u) => [u.slug, u.label]));

/** Build a term → best field weight map per service. */
export function buildSearchIndex(services: Service[]): IndexedService[] {
  return services.map((service) => {
    const terms = new Map<string, number>();
    const add = (text: string, weight: number) => {
      for (const term of tokenize(text)) {
        terms.set(term, Math.max(terms.get(term) ?? 0, weight));
      }
    };

    add(service.name, FIELD_WEIGHTS.name);
    add(service.keywords.join(" "), FIELD_WEIGHTS.keywords);
    add(categoryLabel.get(service.category) ?? service.category, FIELD_WEIGHTS.category);
    add(
      [
        ...service.industries.map((i) => industryLabel.get(i) ?? i),
        ...service.useCases.map((u) => useCaseLabel.get(u) ?? u),
      ].join(" "),
      FIELD_WEIGHTS.facets,
    );
    add(service.summary, FIELD_WEIGHTS.summary);
    add(service.description, FIELD_WEIGHTS.description);

    return { service, terms, name: service.name.toLowerCase() };
  });
}

/** Score how well one query term matches an indexed service (0 = no match). */
function scoreTerm(queryTerm: string, terms: Map<string, number>): number {
  const exact = terms.get(queryTerm);
  if (exact) return exact;

  let best = 0;
  const fuzzyBudget = queryTerm.length >= 8 ? 2 : queryTerm.length >= 4 ? 1 : 0;

  for (const [term, weight] of terms) {
    if (queryTerm.length >= 2 && term.startsWith(queryTerm)) {
      best = Math.max(best, weight * 0.8);
    } else if (fuzzyBudget && withinEditDistance(queryTerm, term, fuzzyBudget)) {
      best = Math.max(best, weight * 0.6);
    }
  }
  return best;
}

/**
 * Return services matching every query term, with a relevance score.
 * An empty query matches everything with score 0.
 */
export function searchIndex(index: IndexedService[], query: string): { service: Service; score: number }[] {
  const queryTerms = tokenize(query);
  if (!queryTerms.length) return index.map(({ service }) => ({ service, score: 0 }));

  const phrase = query.trim().toLowerCase();
  const results: { service: Service; score: number }[] = [];

  for (const entry of index) {
    let score = 0;
    let matchedAll = true;
    for (const term of queryTerms) {
      const termScore = scoreTerm(term, entry.terms);
      if (!termScore) {
        matchedAll = false;
        break;
      }
      score += termScore;
    }
    if (!matchedAll) continue;
    // Boost exact phrase matches in the service name ("business cards").
    if (entry.name.includes(phrase)) score += FIELD_WEIGHTS.name;
    results.push({ service: entry.service, score });
  }

  return results;
}
