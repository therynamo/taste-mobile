// Fixed sample data. The book, its author and every line of its text are invented for this
// example. There is no network and no model: answers are these arrays, streamed word by word.

export const book = {
  title: 'The Saltmarsh Ledger',
  author: 'Odile Marrenby',
  place: 148, // the page the reader is on; the assistant never reads past it
  chaptersRead: 9,
};

export type Paragraph = { text: string; passage?: string };
export type BookPage = {
  page: number;
  chapter: string;
  title: string;
  opener: boolean;
  paragraphs: Paragraph[];
};

export const pages: Record<number, BookPage> = {
  31: {
    page: 31,
    chapter: 'Chapter Two',
    title: 'The Green Book',
    opener: false,
    paragraphs: [
      { text: 'The survey hut had one window, and it faced the wrong way. Aldous Quill had built it so on purpose. A man who can see the water, he said, starts writing down what he expects of it.' },
      { text: 'Her father had taught her that a measurement is a promise. You write down what the water did, he said, not what you can bear for it to have done.', passage: 'p31' },
      { text: 'She was nine then, and the post in the creek was taller than she was. He let her read the mark and he wrote it in the green ledger in his own hand, and beside it, smaller, he wrote her initials.' },
    ],
  },
  112: {
    page: 112,
    chapter: 'Chapter Six',
    title: 'A Prudent Optimism',
    opener: false,
    paragraphs: [
      { text: 'The meeting ran past ten. Nobody in the chapel hall disputed her figures; that was the part she had not prepared for. They disputed what the figures would do to the price of a house on Tannery Row.' },
      { text: 'The council voted nine to two that the published tables should “reflect a prudent optimism”. Hesper copied the phrase onto the flyleaf of the black ledger and underlined it once, as one underlines a diagnosis.', passage: 'p112' },
      { text: 'Thale walked her as far as the sluice. He had voted with the nine. He did not say so, and she did not ask, and the tide went out beside them without taking a side.' },
    ],
  },
  148: {
    page: 148,
    chapter: 'Chapter Nine',
    title: 'The Tide Tables',
    opener: true,
    paragraphs: [
      { text: 'By the second week of October the marsh had stopped pretending. The causeway went under at every spring tide now, and the carters had learned to read the tables pinned to the chapel door the way their grandfathers had read the sky.' },
      { text: 'Hesper kept the true figures in the green ledger and the figures the council wanted in the black one. She did not think of it as lying. The black book was a kind of weather the town could stand to live in; the green one was the sea.', passage: 'p148' },
      { text: 'Thale came down to the survey hut at dusk, as he had every evening since the sluice failed. He did not ask to see either book. He stood in the doorway with his hat in his hands and watched her set the day’s mark against the post, and when she had written it down he said only, “Higher,” and she said, “Higher,” and that was the whole of their quarrel.' },
      { text: 'After he had gone she turned back eleven years in the green ledger, to the first page in her father’s hand, and found the place where his sevens began to lean.' },
    ],
  },
};

export type Passage = { id: string; page: number; chapter: string; quote: string };
export type Answer = {
  id: string;
  question: string;
  askedAt: number;
  askedIn: string;
  steps: string[];
  paragraphs: { text: string; passage: number }[]; // passage is 1-based into `passages`
  passages: Passage[];
  keywords: string[];
};

export const answers: Answer[] = [
  {
    id: 'two-ledgers',
    question: 'Why does Hesper keep two ledgers?',
    askedAt: 148,
    askedIn: 'Chapter Nine',
    steps: ['Read chapters 1 to 9, up to your place on p. 148', 'Looked for both ledgers by name and by colour', 'Found 3 passages'],
    paragraphs: [
      { text: 'Because she owes two different debts. The green ledger is the one her father trained her to keep: the water as it actually stood, entered the same day, with nothing softened.', passage: 1 },
      { text: 'The black ledger began as an instruction, not a choice. After the council’s vote she has to publish gentler figures, and she copies that order onto the flyleaf rather than pretend the numbers are her own.', passage: 2 },
      { text: 'By the page you are on she has stopped calling the black book a lie. She describes it as something the town can live inside, which suggests she keeps it out of care for Brackwater as much as obedience.', passage: 3 },
    ],
    passages: [
      { id: 'p31', page: 31, chapter: 'Chapter Two', quote: 'You write down what the water did, he said, not what you can bear for it to have done.' },
      { id: 'p112', page: 112, chapter: 'Chapter Six', quote: 'The council voted nine to two that the published tables should “reflect a prudent optimism”.' },
      { id: 'p148', page: 148, chapter: 'Chapter Nine', quote: 'The black book was a kind of weather the town could stand to live in; the green one was the sea.' },
    ],
    keywords: ['ledger', 'two', 'black', 'green', 'book'],
  },
  {
    id: 'thale-vote',
    question: 'Whose side is Thale on?',
    askedAt: 112,
    askedIn: 'Chapter Six',
    steps: ['Read chapters 1 to 6, up to p. 112', 'Looked for Thale’s votes and what he says to Hesper', 'Found 2 passages'],
    paragraphs: [
      { text: 'Up to this page, the council’s. He votes with the nine for the gentler tables, and the book makes a point of his not saying so aloud.', passage: 1 },
      { text: 'But he keeps walking her to the sluice, and the narration refuses to rule on him. The book is holding the question open on purpose.', passage: 2 },
    ],
    passages: [
      { id: 'p112', page: 112, chapter: 'Chapter Six', quote: 'He had voted with the nine. He did not say so, and she did not ask.' },
      { id: 'p112', page: 112, chapter: 'Chapter Six', quote: 'The tide went out beside them without taking a side.' },
    ],
    keywords: ['thale', 'side', 'vote', 'council'],
  },
  {
    id: 'wrong-window',
    question: 'Why does the survey hut face away from the water?',
    askedAt: 31,
    askedIn: 'Chapter Two',
    steps: ['Read chapters 1 and 2, up to p. 31', 'Looked for the hut and its window', 'Found 2 passages'],
    paragraphs: [
      { text: 'Aldous built it that way deliberately. He believed that watching the water makes a surveyor write what she expects instead of what the post says.', passage: 1 },
      { text: 'It sets up the rule the rest of the book tests: a measurement is a promise, and it is kept by not looking away from the number.', passage: 2 },
    ],
    passages: [
      { id: 'p31', page: 31, chapter: 'Chapter Two', quote: 'A man who can see the water, he said, starts writing down what he expects of it.' },
      { id: 'p31', page: 31, chapter: 'Chapter Two', quote: 'Her father had taught her that a measurement is a promise.' },
    ],
    keywords: ['hut', 'window', 'face', 'aldous', 'father'],
  },
];

export const seedKept = ['wrong-window', 'thale-vote', 'two-ledgers'];

export function answerById(id: string): Answer | undefined {
  return answers.find((a) => a.id === id);
}

// A typed question is matched to the sample answers by keyword. No match is a real state:
// the answer page says nothing was found, rather than passing off an unrelated answer.
export function matchAnswer(question: string): Answer | undefined {
  const q = question.toLowerCase();
  let best: Answer | undefined;
  let bestScore = 0;
  for (const a of answers) {
    const score = a.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = a;
      bestScore = score;
    }
  }
  return best;
}

export function pageRefs(a: Answer): string {
  const unique = [...new Set(a.passages.map((p) => p.page))];
  return (unique.length > 1 ? 'pp. ' : 'p. ') + unique.join(', ');
}
