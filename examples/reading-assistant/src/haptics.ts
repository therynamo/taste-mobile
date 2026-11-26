import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { hapticsEnabled } from './prefs';

// The only place a haptic is fired. Each call names the interaction and the screen so the
// log can be read in a debug build. iOS only: this example was not built for Android.
type Kind = 'success' | 'error' | 'selection';

export function haptic(kind: Kind, interaction: string, screen: string) {
  if (__DEV__) console.log(JSON.stringify({ interaction, type: kind, timestamp: Date.now(), screen }));
  if (!hapticsEnabled() || Platform.OS !== 'ios') return;
  if (kind === 'success') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (kind === 'error') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  else void Haptics.selectionAsync();
}
