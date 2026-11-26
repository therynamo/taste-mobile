import { Pressable, StyleSheet, Text, View } from 'react-native';
import { answers, pageRefs } from '../data';
import type { ScreenProps } from '../nav';
import { BookText, Caps, Folio, Hung, InkButton, Page, Ribbon, Rule, RunningHead, Ui, useStacked } from '../page';
import { usePrefs } from '../prefs';
import { cap, hit, space, type } from '../tokens';

/** Kept answers, set as the index at the back of the book: grouped by the chapter they were asked from. */
export function KeptScreen({ navigation }: ScreenProps<'Kept'>) {
  const { c, family, kept } = usePrefs();
  const stacked = useStacked();
  const list = answers.filter((a) => kept.includes(a.id)).sort((a, b) => a.askedAt - b.askedAt);

  return (
    <Page>
      <RunningHead right="Index">{list.length === 0 ? null : <Ribbon />}</RunningHead>
      <Text accessibilityRole="header" maxFontSizeMultiplier={cap.title1} style={[type.title1, styles.title, { color: c.ink, fontFamily: family }]}>Kept answers</Text>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <BookText>Nothing is kept yet.</BookText>
          <Ui soft style={styles.emptyHelp}>Ask about the book from any page. Keep an answer and it is filed here under the chapter you asked from, with the pages it points to.</Ui>
          <InkButton label="Back to the book" onPress={() => navigation.goBack()} />
        </View>
      ) : (
        list.map((a, i) => (
          <View key={a.id} style={styles.group}>
            <Caps style={styles.groupHead}>Asked in {a.askedIn}</Caps>
            <Rule />
            <Hung mark={String(i + 1)} label={`Kept answer ${i + 1}`} style={styles.hung}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${a.question}. ${pageRefs(a)}`}
                accessibilityHint="Opens the answer"
                onPress={() => navigation.navigate('Answer', { answerId: a.id, mode: 'settled' })}
                style={({ pressed }) => [styles.entry, pressed && styles.pressed]}
              >
                <View style={stacked ? undefined : styles.entryRow}>
                  <Ui style={[styles.question, !stacked && styles.flex]}>{a.question}</Ui>
                  <Text maxFontSizeMultiplier={cap.subhead} style={[type.subhead, styles.refs, { color: c.ribbon }]}>{pageRefs(a)}</Text>
                </View>
                {stacked ? null : (
                  <BookText soft style={styles.excerpt}>{a.paragraphs[0].text}</BookText>
                )}
              </Pressable>
            </Hung>
          </View>
        ))
      )}
      {list.length === 0 ? null : <Folio>{`${list.length} kept`}</Folio>}
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontWeight: '600', marginBottom: space.l },
  group: { marginTop: space.l },
  groupHead: { marginBottom: space.s },
  hung: { marginTop: space.m },
  entry: { minHeight: hit, gap: space.s },
  entryRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.l },
  question: { fontWeight: '600' },
  refs: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  excerpt: { ...type.subhead, lineHeight: 23 },
  empty: { gap: space.l, marginTop: space.s },
  emptyHelp: { marginBottom: space.s },
  pressed: { opacity: 0.55 },
});
