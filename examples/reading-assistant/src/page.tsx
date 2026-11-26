import { useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { book } from './data';
import { usePrefs } from './prefs';
import { cap, hit, motion, radius, space, stackedAt, type } from './tokens';

// The governing asset: one page block with 30 pt margins. Body text never enters the margin;
// the only things hung there are note numerals. At large text sizes the numerals move inline.

export function useStacked(): boolean {
  return useWindowDimensions().fontScale > stackedAt;
}

type TextProps = { children: ReactNode; style?: StyleProp<TextStyle>; soft?: boolean; lines?: number };

/** Words that are the book or annotate it: set in the face the reader chose. */
export function BookText({ children, style, soft }: TextProps) {
  const { c, family } = usePrefs();
  return <Text maxFontSizeMultiplier={cap.page} style={[type.page, { color: soft ? c.inkSoft : c.ink, fontFamily: family }, style]}>{children}</Text>;
}

/** Everything the reader types or taps: the platform face. */
export function Ui({ children, style, soft, lines }: TextProps) {
  const { c } = usePrefs();
  return (
    <Text numberOfLines={lines} maxFontSizeMultiplier={cap.body} style={[type.body, { color: soft ? c.inkSoft : c.ink }, style]}>
      {children}
    </Text>
  );
}

export function Caps({ children, style }: TextProps) {
  const { c } = usePrefs();
  return <Text maxFontSizeMultiplier={cap.furniture} style={[type.caption, styles.caps, { color: c.inkSoft }, style]}>{children}</Text>;
}

export function Rule({ short, style }: { short?: boolean; style?: StyleProp<ViewStyle> }) {
  const { c } = usePrefs();
  return <View style={[{ height: StyleSheet.hairlineWidth * 2, backgroundColor: c.rule }, short && styles.shortRule, style]} />;
}

/** A numeral hung in the left margin beside its content. */
export function Hung({ mark, label, children, style }: { mark?: string; label?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = usePrefs();
  const stacked = useStacked();
  if (mark === undefined) return <View style={style}>{children}</View>;
  if (stacked) {
    return (
      <View style={style}>
        <Text maxFontSizeMultiplier={cap.furniture} style={[type.footnote, styles.numeral, styles.stackedLabel, { color: c.ribbon }]}>{label ?? `Note ${mark}`}</Text>
        {children}
      </View>
    );
  }
  return (
    <View style={[styles.hungRow, style]}>
      <View style={styles.hungMargin} accessible accessibilityLabel={label ?? `Note ${mark}`}>
        <Text style={[type.footnote, styles.numeral, styles.hungNumeral, { color: c.ribbon }]}>{mark}</Text>
      </View>
      <View style={styles.flex}>{children}</View>
    </View>
  );
}

/** Top of every page: book title on the left, where you are on the right, a rule beneath. */
export function RunningHead({ right, children }: { right: string; children?: ReactNode }) {
  return (
    <View style={styles.head}>
      <View style={styles.headRow}>
        <Caps>{book.title}</Caps>
        <Caps style={styles.headRight}>{right}</Caps>
      </View>
      <Rule />
      {children}
    </View>
  );
}

export function Folio({ children }: { children: ReactNode }) {
  const { c } = usePrefs();
  return <Text maxFontSizeMultiplier={cap.furniture} style={[type.footnote, styles.folio, { color: c.inkSoft }]}>{children}</Text>;
}

/** The kept ribbon. It hangs from the running-head rule. */
export function Ribbon({ drop }: { drop?: Animated.Value }) {
  const { c } = usePrefs();
  const band = (
    <View style={[styles.ribbon, { backgroundColor: c.ribbon }]}>
      <View style={[styles.ribbonNotch, { backgroundColor: c.paper }]} />
    </View>
  );
  if (!drop) return <View style={styles.ribbonSlot} accessible accessibilityLabel="Kept">{band}</View>;
  const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [-RIBBON_H, 0] });
  return (
    <View style={styles.ribbonSlot} pointerEvents="none">
      <Animated.View style={{ opacity: drop, transform: [{ translateY }] }}>{band}</Animated.View>
    </View>
  );
}

/** A small drawn tick: the only "icon" in the app besides the ribbon. */
export function Tick({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <View style={[styles.tickBox, { transform: [{ scale }] }]}>
      <View style={[styles.tick, { borderColor: color }]} />
    </View>
  );
}

type ButtonProps = { label: string; onPress: () => void; disabled?: boolean; outline?: boolean; hint?: string };

/** The one button shape: an ink pill, filled for the primary action, outlined otherwise. */
export function InkButton({ label, onPress, disabled, outline, hint }: ButtonProps) {
  const { c } = usePrefs();
  const dim = useRef(new Animated.Value(1)).current;
  const press = (to: number) => Animated.timing(dim, { toValue: to, duration: motion.pressMs, useNativeDriver: true }).start();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => press(0.72)}
      onPressOut={() => press(1)}
    >
      <Animated.View
        style={[
          styles.button,
          outline ? { borderColor: c.ink, borderWidth: 1.5 } : { backgroundColor: c.ink },
          { opacity: disabled ? 0.38 : dim },
        ]}
      >
        <Text maxFontSizeMultiplier={cap.title3} style={[type.body, styles.buttonLabel, { color: outline ? c.ink : c.onInk }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** A text link with a full-size hit region. */
export function Link({ label, onPress, style, color }: { label: string; onPress: () => void; style?: StyleProp<TextStyle>; color?: string }) {
  const { c } = usePrefs();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
      <Text maxFontSizeMultiplier={cap.subhead} style={[type.subhead, styles.linkLabel, { color: color ?? c.ink }, style]}>{label}</Text>
    </Pressable>
  );
}

type PageProps = {
  children: ReactNode;
  foot?: ReactNode;
  /** An action foot joins the page at large text sizes; an input foot always stays pinned. */
  footKind?: 'input' | 'action';
  /** Fades the page back while the reader is writing (hero moment 1). */
  recede?: Animated.Value;
  sheet?: boolean;
};

/** The page: paper ground, 30 pt margins, content laid out from the header and safe-area insets. */
export function Page({ children, foot, footKind = 'input', recede, sheet }: PageProps) {
  const { c } = usePrefs();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const stacked = useStacked();
  if (sheet) {
    // A native form sheet sizes its own content: the scroll view is the screen's direct child.
    return (
      <ScrollView style={{ backgroundColor: c.paper }} contentContainerStyle={{ padding: space.margin, paddingTop: space.l, paddingBottom: insets.bottom + space.xxl }}>
        {children}
      </ScrollView>
    );
  }
  const inline = foot && footKind === 'action' && stacked;
  const pinned = foot && !inline;
  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.flex, { backgroundColor: c.paper }]}>
      <ScrollView
        style={styles.flex}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: headerHeight + space.s,
          paddingHorizontal: space.margin,
          paddingBottom: pinned ? space.xl : insets.bottom + space.xl,
        }}
      >
        <Animated.View style={recede ? { opacity: recede } : undefined}>{children}</Animated.View>
        {inline ? <View style={styles.inlineFoot}>{foot}</View> : null}
      </ScrollView>
      {pinned ? (
        <View style={[styles.foot, { borderTopColor: c.rule, backgroundColor: c.paper, paddingBottom: Math.max(insets.bottom, space.m) }]}>{foot}</View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

/** The ask line: a ruled line at the foot of the page, not a chat composer. */
export function AskLine({ onAsk, onFocusChange }: { onAsk: (question: string) => void; onFocusChange?: (focused: boolean) => void }) {
  const { c } = usePrefs();
  const stacked = useStacked();
  const [text, setText] = useState('');
  const ready = text.trim().length > 0;
  const submit = () => {
    if (!ready) return;
    onAsk(text.trim());
    setText('');
  };
  return (
    <View style={styles.askRow}>
      <TextInput
        accessibilityLabel="Ask about this book"
        value={text}
        onChangeText={setText}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        onSubmitEditing={submit}
        placeholder="Ask about this book"
        placeholderTextColor={c.inkSoft}
        selectionColor={c.ink}
        returnKeyType="send"
        submitBehavior="blurAndSubmit"
        multiline
        maxFontSizeMultiplier={cap.body}
        style={[type.body, styles.askInput, { color: c.ink }]}
      />
      {stacked && !ready ? null : <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ask"
        accessibilityState={{ disabled: !ready }}
        disabled={!ready}
        onPress={submit}
        style={({ pressed }) => [styles.askSend, pressed && styles.pressed]}
      >
        <Text maxFontSizeMultiplier={cap.title3} style={[type.body, styles.buttonLabel, { color: ready ? c.ink : c.inkSoft }]}>Ask</Text>
      </Pressable>}
    </View>
  );
}

const RIBBON_W = 16;
const RIBBON_H = 30;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  caps: { textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '600' },
  shortRule: { width: 72 },
  hungRow: { flexDirection: 'row', marginLeft: -space.margin },
  hungMargin: { width: space.margin, alignItems: 'flex-end', paddingRight: space.s },
  hungNumeral: { lineHeight: type.page.lineHeight },
  stackedLabel: { marginBottom: space.xs },
  headRight: { textAlign: 'right' },
  inlineFoot: { marginTop: space.xl },
  numeral: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  head: { marginBottom: space.xl },
  headRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: space.l, rowGap: space.hair, paddingBottom: space.s },
  folio: { textAlign: 'center', marginTop: space.xxl, fontVariant: ['tabular-nums'] },
  ribbonSlot: { position: 'absolute', right: 0, bottom: -RIBBON_H, height: RIBBON_H, width: RIBBON_W, overflow: 'hidden' },
  ribbon: { width: RIBBON_W, height: RIBBON_H, alignItems: 'center', justifyContent: 'flex-end' },
  ribbonNotch: { width: RIBBON_W * 0.72, height: RIBBON_W * 0.72, marginBottom: -RIBBON_W * 0.36, transform: [{ rotate: '45deg' }] },
  tickBox: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 6, height: 11, borderRightWidth: 2, borderBottomWidth: 2, transform: [{ rotate: '45deg' }], marginTop: -3 },
  button: { minHeight: hit + 4, borderRadius: radius.control + 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl, paddingVertical: space.m },
  buttonLabel: { fontWeight: '600', textAlign: 'center' },
  link: { minHeight: hit, justifyContent: 'center' },
  linkLabel: { fontWeight: '600', textDecorationLine: 'underline' },
  pressed: { opacity: 0.55 },
  foot: { borderTopWidth: StyleSheet.hairlineWidth * 2, paddingHorizontal: space.margin, paddingTop: space.s },
  askRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.m },
  askInput: { flex: 1, minHeight: hit, paddingTop: space.m, paddingBottom: space.m },
  askSend: { minHeight: hit, minWidth: hit, alignItems: 'center', justifyContent: 'center' },
});
