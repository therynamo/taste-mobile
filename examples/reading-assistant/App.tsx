import { DefaultTheme, NavigationContainer, type InitialState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { launch } from './src/launch';
import type { Routes } from './src/nav';
import { PrefsProvider, usePrefs } from './src/prefs';
import { AnswerScreen } from './src/screens/AnswerScreen';
import { BookScreen } from './src/screens/BookScreen';
import { KeptScreen } from './src/screens/KeptScreen';
import { TypeSheet } from './src/screens/TypeSheet';
import { cap, hit, space, type } from './src/tokens';

const Stack = createNativeStackNavigator<Routes>();

// Every screen opens directly from launch arguments, for example `-screen answer -state streaming`.
function initialState(): InitialState {
  const book = { name: 'Book' };
  const answer = (mode: string) => ({ name: 'Answer', params: { answerId: 'two-ledgers', mode } });
  const passage = Math.max(1, Math.min(3, Number(launch.passage ?? 2) || 2));
  switch (launch.screen) {
    case 'answer':
      return { routes: [book, answer(launch.state === 'streaming' ? 'frozen' : launch.state === 'error' ? 'error' : 'settled')] };
    case 'passage':
      return { routes: [book, answer('settled'), { name: 'Passage', params: { answerId: 'two-ledgers', passage } }] };
    case 'kept':
      return { routes: [book, { name: 'Kept' }] };
    case 'type':
      return { routes: [book, { name: 'Type' }] };
    default:
      return { routes: [book] };
  }
}

// Bar items sit in the system bar, which caps its own text size; these follow it up to cap.bar.

function BarItem({ label, spoken, onPress }: { label: string; spoken: string; onPress: () => void }) {
  const { c } = usePrefs();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={spoken} onPress={onPress} style={({ pressed }) => [styles.barItem, pressed && styles.pressed]}>
      <Text maxFontSizeMultiplier={cap.bar} style={[type.body, styles.barLabel, { color: c.ink }]}>{label}</Text>
    </Pressable>
  );
}

function Shell() {
  const { c, dark } = usePrefs();
  const theme = {
    ...DefaultTheme,
    dark,
    colors: { ...DefaultTheme.colors, background: c.paper, card: c.paper, text: c.ink, primary: c.ink, border: c.rule, notification: c.ribbon },
  };
  return (
    <NavigationContainer theme={theme} initialState={initialState()}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          title: '',
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: c.ink,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: c.paper },
        }}
      >
        <Stack.Screen
          name="Book"
          component={BookScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <View style={styles.barGroup}>
                <BarItem label="Kept" spoken="Kept answers" onPress={() => navigation.navigate('Kept')} />
                <BarItem label="Aa" spoken="Type and page" onPress={() => navigation.navigate('Type')} />
              </View>
            ),
          })}
        />
        <Stack.Screen name="Passage" component={BookScreen} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
        <Stack.Screen name="Kept" component={KeptScreen} />
        <Stack.Screen
          name="Type"
          component={TypeSheet}
          options={({ navigation }) => ({
            presentation: 'formSheet',
            sheetAllowedDetents: [0.75, 1],
            sheetGrabberVisible: true,
            title: 'Type and page',
            headerTransparent: false,
            headerStyle: { backgroundColor: c.paper },
            headerRight: () => <BarItem label="Done" spoken="Done" onPress={() => navigation.goBack()} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PrefsProvider>
        <Shell />
      </PrefsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  barGroup: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  barItem: { minHeight: hit, minWidth: hit, paddingHorizontal: space.s, alignItems: 'center', justifyContent: 'center' },
  barLabel: { fontWeight: '600' },
  pressed: { opacity: 0.55 },
});
