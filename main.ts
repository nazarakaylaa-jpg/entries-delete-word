// The Word You'd Delete From the Dictionary — one word, nothing else.
//
// The pick: "colonel".
//
// The program scores each candidate against the judge's brief, most
// important criterion first, and writes the winner. The weights below
// mirror the brief's order: instant joke, humour from the word itself,
// freshness, then exactness.
//
// Why "colonel" wins:
//   - Funny at first sight: every English speaker knows the joke already —
//     the word is pronounced "kernel" and spelled nothing like it. Delete
//     it and the most absurd spelling in the language goes with it.
//   - The humour comes from the word itself: its sound, its spelling, and
//     the gap it would leave. No shock, no caption needed.
//   - Fresh: the field's first thoughts will be "moist" and the grammar
//     pet peeves ("irregardless", "literally"). "colonel" is instantly
//     understood and nobody's first pick.
//
// Candidates weighed and rejected:
//   - moist: the obvious pick; half the field will submit it, so it fails
//     the freshness criterion outright.
//   - irregardless: a known pet peeve, but the joke is about people who say
//     it, not about the word itself.
//   - literally: same problem; the humour is the misuse, and the word
//     itself is ordinary.
//   - queue: four silent letters, genuinely funny, but the joke needs a
//     beat ("q + four silent letters") while "colonel" lands the moment
//     you read it.
//   - Worcestershire: the same spelling joke, but parochial; a global
//     judge pool will not all get it instantly.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  word: string;
  instant: number; // 0-5: joke lands at first sight
  fromWord: number; // 0-5: humour comes from the word itself
  fresh: number; // 0-5: the field would not think of it first
};

const CANDIDATES: Candidate[] = [
  { word: "colonel", instant: 5, fromWord: 5, fresh: 4 },
  { word: "queue", instant: 4, fromWord: 5, fresh: 3 },
  { word: "moist", instant: 4, fromWord: 3, fresh: 1 },
  { word: "irregardless", instant: 3, fromWord: 2, fresh: 2 },
  { word: "literally", instant: 3, fromWord: 2, fresh: 2 },
  { word: "worcestershire", instant: 3, fromWord: 4, fresh: 3 },
];

// Lexicographic by the brief's criterion order: the first criterion where
// two candidates differ decides, unless a later one differs by much more.
// A 2+ point gap on a later criterion outweighs a 1 point gap earlier.
function score(a: Candidate, b: Candidate): number {
  const criteria: Array<keyof Pick<Candidate, "instant" | "fromWord" | "fresh">> = [
    "instant",
    "fromWord",
    "fresh",
  ];
  for (let i = 0; i < criteria.length; i++) {
    const gap = a[criteria[i]] - b[criteria[i]];
    if (gap !== 0) {
      for (let j = i + 1; j < criteria.length; j++) {
        const later = b[criteria[j]] - a[criteria[j]];
        if (later >= 2) return -later;
      }
      return gap;
    }
  }
  return 0;
}

const ranked = [...CANDIDATES].sort((a, b) => score(b, a) - score(a, b));
const WORD = ranked[0].word;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Self-check against the sealed gate: /output/entry.txt must be UTF-8
// text of 1 to 77 characters, not only white space, and the brief demands
// exactly one word, spelled correctly, with nothing added around it.
const chars = [...WORD].length;
if (chars < 1 || chars > 77 || !WORD.trim()) {
  throw new Error(`entry fails the gate (${chars} characters)`);
}
if (/\s/.test(WORD) || WORD !== WORD.toLowerCase()) {
  throw new Error("entry must be exactly one lowercase word");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), WORD, "utf8");
console.log(`wrote ${chars}-character entry: ${WORD}`);
