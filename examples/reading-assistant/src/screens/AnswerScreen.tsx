import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { answerById, book } from '../data';
import { haptic } from '../haptics';
import { settle, useReducedMotion } from '../motion';
import type { ScreenProps } from '../nav';
import { BookText, Folio, Hung, InkButton, Page, Ribbon, Rule, RunningHead, Tick, Ui, useStacked } from '../page';
import { usePrefs } from '../prefs';
import { cap, hit, space, type } from '../tokens';

const STEP_MS = 520; // one status line resolves
const WORD_MS = 42; // one word of the answer arrives
const FROZEN_WORDS = 46; // where "-state streaming" holds the stream for capture

/** One question, its answer set as page text, and the passages it stands on. */
export function AnswerScreen({ navigation, route }: ScreenProps<'Answer'>) {
  const { c, kept, setKept } = usePrefs();
  const reduced = useReducedMotion();
  const { answerId, mode } = route.params;
  const answer = answerId ? answerById(answerId) : undefined;
  const question = route.params.question ?? answer?.question ?? '';

  const total = useMemo(() => (answer ? answer.paragraphs.reduce((n, p) => n + p.text.split(' ').length, 0) : 0), [answer]);
  const live = mode === 'stream' || mode === 'frozen';
  const [stepsDone, setStepsDone] = useState(live ? (mode === 'frozen' ? 3 : 0) : 3);
  const [words, setWords] = useState(mode === 'frozen' ? FROZEN_WORDS : live ? 0 : total);
  const [open, setOpen] = useState(false);
  const done = mode !== 'error' && (!answer || words >= total) && stepsDone >= 3;
  const isKept = !!answer && done && kept.includes(answer.id);

  // The stream: three status lines resolve, then the answer arrives a word at a time from the array.
  useEffect(() => {
    if (mode !== 'stream') return;
    if (stepsDone < 3) {
      const t = setTimeout(() => setStepsDone((n) => n + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    if (words < total) {
      const t = setTimeout(() => setWords((n) => Math.min(total, n + 1)), WORD_MS);
      return () => clearTimeout(t);
    }
  }, [mode, stepsDone, words, total]);

  // Hero moment 2: the ribbon drops from the running-head rule when the answer is kept.
  const drop = useRef(new Animated.Value(isKept ? 1 : 0)).current;
  const shown = useRef(isKept);
  useEffect(() => {
    if (shown.current === isKept) return;
    shown.current = isKept;
    settle(drop, isKept ? 1 : 0, reduced).start();
  }, [isKept, drop, reduced]);
  const toggleKeep = () => {
    if (!answer) return;
    const next = !isKept;
    setKept(answer.id, next); // written to the kept store before the haptic fires
    if (next) haptic('success', 'answer kept', 'answer');
  };

  const steps = answer?.steps ?? [`Read chapters 1 to ${book.chaptersRead}, up to your place on p. ${book.place}`, 'Looked for the words in your question', 'Found no passages'];
  const failed = mode === 'error';
  const stacked = useStacked();
  // Step marks grow with the text beside them, up to twice their size.
  const markScale = Math.min(useWindowDimensions().fontScale, 2);
  const markBox = { width: 20 * markScale, height: type.footnote.lineHeight * Math.min(useWindowDimensions().fontScale, cap.footnote) };
  const summary = failed ? 'Stopped before finishing' : answer ? `Read to p. ${answer.askedAt} · found ${answer.passages.length} passages` : 'Read to your place · found no passages';
  const showSteps = !done || open || failed;

  let budget = words;
  return (
    <Page
      footKind="action"
      foot={
        answer && !failed ? (
          <View style={styles.footPad}>
            <InkButton
              label={isKept ? 'Kept · remove' : 'Keep this answer'}
              hint={isKept ? 'Removes this answer from your kept answers' : 'Files this answer with your kept answers'}
              outline={isKept}
              disabled={!done}
              onPress={toggleKeep}
            />
          </View>
        ) : undefined
      }
    >
      <RunningHead right={answer ? `Asked at p. ${answer.askedAt}` : `Asked at p. ${book.place}`}>
        <Ribbon drop={drop} />
      </RunningHead>

      <Text accessibilityRole="header" maxFontSizeMultiplier={cap.title3} style={[type.title3, styles.question, { color: c.ink }]}>{question}</Text>

      {done ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={`${summary}. ${open ? 'Hide steps' : 'Show steps'}`}
          onPress={() => setOpen((v) => !v)}
          style={({ pressed }) => [styles.summary, stacked && styles.summaryStacked, pressed && styles.pressed]}
        >
          <Ui soft style={[type.footnote, !stacked && styles.flex]}>{summary}</Ui>
          <Ui style={[type.footnote, styles.disclose]}>{open ? 'Hide steps' : 'Show steps'}</Ui>
        </Pressable>
      ) : null}

      {showSteps ? (
        <View style={styles.steps}>
          {steps.map((s, i) => {
            const stopped = failed && i === 1;
            if (failed && i > 1) return null;
            const state = stopped ? 'stopped' : i < stepsDone ? 'done' : i === stepsDone ? 'active' : 'waiting';
            if (state === 'waiting') return null;
            return (
              <View key={s} style={styles.step}>
                <View style={[styles.stepMark, markBox]}>
                  {state === 'active' ? <ActivityIndicator size="small" color={c.inkSoft} /> : state === 'done' ? <Tick color={c.inkSoft} scale={markScale} /> : <View style={[styles.stop, { backgroundColor: c.ink, transform: [{ scale: markScale }] }]} />}
                </View>
                <Ui soft={state !== 'stopped'} style={[type.footnote, styles.flex]}>{stopped ? 'Stopped: this copy has no page map after chapter 6' : s}</Ui>
              </View>
            );
          })}
        </View>
      ) : null}

      {failed ? (
        <View style={styles.block}>
          <BookText>No answer was written. Without page numbers an answer could not point to its passages, so none is shown.</BookText>
          <View style={styles.retry}>
            <InkButton label="Try again" onPress={() => navigation.replace('Answer', { answerId: answerId ?? 'two-ledgers', question, mode: 'stream' })} />
          </View>
        </View>
      ) : !answer && done ? (
        <View style={styles.block}>
          <BookText>Nothing in the pages you have read speaks to that. Try naming a person, a place or an object from the book.</BookText>
        </View>
      ) : answer ? (
        <View style={styles.block}>
          {answer.paragraphs.map((p, i) => {
            const all = p.text.split(' ');
            const take = Math.max(0, Math.min(all.length, budget));
            budget -= take;
            if (take === 0) return null;
            const source = take === all.length ? answer.passages[p.passage - 1] : undefined;
            return (
              <Hung key={i} mark={String(p.passage)} label={`Passage ${p.passage}`} style={styles.paragraph}>
                <BookText>{all.slice(0, take).join(' ')}</BookText>
                {source ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Passage ${p.passage}, page ${source.page}, ${source.chapter}. ${source.quote}`}
                    accessibilityHint="Opens the book at this passage"
                    onPress={() => navigation.navigate('Passage', { answerId: answer.id, passage: p.passage })}
                    style={({ pressed }) => [styles.passage, { borderLeftColor: c.rule }, pressed && styles.pressed]}
                  >
                    <BookText soft style={styles.quote}>{source.quote}</BookText>
                    <Text maxFontSizeMultiplier={cap.footnote} style={[type.footnote, styles.ref, { color: c.ribbon }]}>p. {source.page} · {source.chapter}</Text>
                  </Pressable>
                ) : null}
              </Hung>
            );
          })}
          {!done && stepsDone >= 3 ? (
            <View style={styles.step}>
              <View style={[styles.stepMark, markBox]}><ActivityIndicator size="small" color={c.inkSoft} /></View>
              <Ui soft style={[type.footnote, styles.flex]}>Writing from {answer.passages.length} passages</Ui>
            </View>
          ) : null}
        </View>
      ) : null}

      {answer && done ? (
        <>
          <Rule short />
          <Ui soft style={[type.footnote, styles.fence]}>Nothing after your place on p. {answer.askedAt} was read.</Ui>
        </>
      ) : null}
      {done ? <Folio>Note</Folio> : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  question: { fontWeight: '700', marginBottom: space.s },
  summary: { minHeight: hit, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space.m },
  disclose: { fontWeight: '600', textDecorationLine: 'underline' },
  summaryStacked: { flexDirection: 'column', alignItems: 'flex-start', paddingVertical: space.s },
  steps: { gap: space.s, marginTop: space.xs, marginBottom: space.s },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s },
  stepMark: { width: 20, height: type.footnote.lineHeight, alignItems: 'center', justifyContent: 'center' },
  stop: { width: 8, height: 8 },
  block: { marginTop: space.l },
  paragraph: { marginBottom: space.xl },
  retry: { marginTop: space.xl },
  passage: { minHeight: hit, justifyContent: 'center', marginTop: space.m, paddingLeft: space.m, borderLeftWidth: 2, gap: space.xs },
  quote: { ...type.body, lineHeight: 24, fontStyle: 'italic' },
  ref: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  fence: { marginTop: space.m },
  footPad: { paddingTop: space.xs },
  pressed: { opacity: 0.55 },
});
