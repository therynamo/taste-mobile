import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { haptic } from '../haptics';
import { Caps, Page, Rule, Tick, Ui, useStacked } from '../page';
import { usePrefs } from '../prefs';
import { cap, faces, hit, palettes, space, tints, type } from '../tokens';

/** The native sheet for the two things the reader chooses: the book's face and the page tint. */
export function TypeSheet() {
  const { c, face, tint, family, hapticsEnabled, setFace, setTint, setHapticsEnabled } = usePrefs();
  const stacked = useStacked();

  return (
    <Page sheet>
      <Text maxFontSizeMultiplier={cap.page} style={[type.page, { color: c.ink, fontFamily: family }]}>The black book was a kind of weather the town could stand to live in; the green one was the sea.</Text>

      <Caps style={styles.head}>Face for this book</Caps>
      <Rule />
      {faces.map((f) => {
        const selected = f.id === face;
        return (
          <View key={f.id}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={f.name}
              onPress={() => {
                if (!selected) haptic('selection', 'face chosen', 'type');
                setFace(f.id);
              }}
              style={({ pressed }) => [styles.row, { borderBottomColor: c.rule }, pressed && styles.pressed]}
            >
              <Text maxFontSizeMultiplier={cap.title3} style={[type.title3, styles.flex, { color: c.ink, fontFamily: f.family, fontWeight: selected ? '700' : '400' }]}>{f.name}</Text>
              {selected ? <Tick color={c.ink} /> : null}
            </Pressable>
          </View>
        );
      })}

      <Caps style={styles.head}>Page</Caps>
      <Rule />
      <View style={styles.tints}>
        {tints.map((t) => {
          const selected = t.id === tint;
          const swatch = t.id === 'system' ? c.paper : palettes[t.id].paper;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${t.name} page`}
              onPress={() => {
                if (!selected) haptic('selection', 'tint chosen', 'type');
                setTint(t.id);
              }}
              style={({ pressed }) => [styles.tint, stacked && styles.tintStacked, pressed && styles.pressed]}
            >
              <View style={[styles.swatch, { backgroundColor: swatch, borderColor: selected ? c.ink : c.rule, borderWidth: selected ? 2 : 1 }]}>
                {selected ? <Tick color={t.id === 'night' ? palettes.night.ink : t.id === 'system' ? c.ink : palettes[t.id].ink} /> : null}
              </View>
              <Ui style={[type.footnote, { fontWeight: selected ? '700' : '400' }]}>{t.name}</Ui>
            </Pressable>
          );
        })}
      </View>

      <Rule />
      <View style={styles.row}>
        <Ui style={styles.flex}>Haptics</Ui>
        <Switch accessibilityLabel="Haptics" value={hapticsEnabled} onValueChange={setHapticsEnabled} trackColor={{ true: c.ink, false: c.rule }} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { marginTop: space.xl, marginBottom: space.s },
  row: { minHeight: hit + space.s, flexDirection: 'row', alignItems: 'center', gap: space.m, paddingVertical: space.s, borderBottomWidth: StyleSheet.hairlineWidth },
  tints: { flexDirection: 'row', flexWrap: 'wrap', gap: space.m, paddingVertical: space.l },
  // Four swatches share one row; at accessibility text sizes they wrap two to a row.
  tint: { flexBasis: '20%', flexGrow: 1, minHeight: hit, gap: space.s },
  tintStacked: { flexBasis: '40%' },
  swatch: { alignSelf: 'stretch', height: hit, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.55 },
});
