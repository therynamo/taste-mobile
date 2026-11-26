import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { answerById, answers, book, matchAnswer, pages } from '../data';
import { useReducedMotion, settle } from '../motion';
import type { ScreenProps } from '../nav';
import { AskLine, BookText, Caps, Folio, Hung, Page, Rule, RunningHead, Ui } from '../page';
import { usePrefs } from '../prefs';
import { cap, hit, radius, space, type } from '../tokens';

type Footnote = { mark: string; text: string; detail: string; onPress: () => void };

/** The book page. Opened plain it is the reader's place; opened from an answer it shows one cited passage. */
export function BookScreen({ navigation, route }: ScreenProps<'Book'> | ScreenProps<'Passage'>) {
  const { c, family, kept } = usePrefs();
  const reduced = useReducedMotion();
  const recede = useRef(new Animated.Value(1)).current;
  const nav = navigation as ScreenProps<'Book'>['navigation'];

  const cited = route.name === 'Passage' ? route.params : undefined;
  const citing = cited ? answerById(cited.answerId) : undefined;
  const citedPassage = citing?.passages[(cited?.passage ?? 1) - 1];
  const page = pages[citedPassage?.page ?? book.place];

  // Which paragraphs carry a numeral, and the footnote each numeral leads to.
  const marks = new Map<string, string>();
  const footnotes: Footnote[] = [];
  if (citing && cited && citedPassage) {
    marks.set(citedPassage.id, String(cited.passage));
    footnotes.push({
      mark: String(cited.passage),
      text: citing.question,
      detail: `Passage ${cited.passage} of ${citing.passages.length} in this answer`,
      onPress: () => nav.goBack(),
    });
  } else {
    for (const a of answers.filter((x) => kept.includes(x.id))) {
      const here = a.passages.find((p) => p.page === page.page);
      if (!here) continue;
      const mark = marks.get(here.id) ?? String(marks.size + 1);
      marks.set(here.id, mark);
      footnotes.push({ mark, text: a.question, detail: 'Kept answer', onPress: () => nav.navigate('Answer', { answerId: a.id, mode: 'settled' }) });
    }
  }

  const ask = (question: string) => {
    const match = matchAnswer(question);
    nav.navigate('Answer', { answerId: match?.id, question, mode: 'stream' });
  };

  return (
    <Page
      recede={recede}
      foot={<AskLine onAsk={ask} onFocusChange={(focused) => settle(recede, focused ? 0.3 : 1, reduced, 'springEffects').start()} />}
    >
      <RunningHead right={page.chapter} />
      {page.opener ? (
        <View style={styles.opener}>
          <Caps>{page.chapter}</Caps>
          <Text accessibilityRole="header" maxFontSizeMultiplier={cap.title1} style={[type.title1, styles.title, { color: c.ink, fontFamily: family }]}>{page.title}</Text>
        </View>
      ) : null}
      {page.paragraphs.map((p, i) => {
        const mark = p.passage ? marks.get(p.passage) : undefined;
        const washed = mark !== undefined && cited !== undefined;
        return (
          <Hung key={i} mark={mark} style={styles.paragraph}>
            <View style={washed ? [styles.wash, { backgroundColor: c.mark }] : undefined}>
              <BookText>{p.text}</BookText>
            </View>
          </Hung>
        );
      })}
      {footnotes.length > 0 ? (
        <View style={styles.notes}>
          <Rule short />
          {footnotes.map((f) => (
            <Hung key={f.mark + f.text} mark={f.mark}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Note ${f.mark}. ${f.text}. ${f.detail}`}
                onPress={f.onPress}
                style={({ pressed }) => [styles.note, pressed && styles.pressed]}
              >
                <Ui style={styles.noteQuestion}>{f.text}</Ui>
                <Ui soft style={type.footnote}>{f.detail}</Ui>
              </Pressable>
            </Hung>
          ))}
        </View>
      ) : null}
      <Folio>{page.page}</Folio>
    </Page>
  );
}

const styles = StyleSheet.create({
  opener: { marginBottom: space.xl, gap: space.s },
  title: { fontWeight: '600' },
  paragraph: { marginBottom: space.l },
  wash: { borderRadius: radius.wash, marginHorizontal: -space.xs, paddingHorizontal: space.xs },
  notes: { marginTop: space.l, gap: space.s },
  note: { minHeight: hit, justifyContent: 'center', paddingVertical: space.xs },
  noteQuestion: { ...type.subhead, fontWeight: '600' },
  pressed: { opacity: 0.55 },
});
