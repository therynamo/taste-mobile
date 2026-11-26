import { Settings } from 'react-native';

// `xcrun simctl launch <udid> <bundle id> -screen answer -state streaming` puts each
// "-key value" pair in the NSUserDefaults argument domain. React Native's built-in Settings
// module exports NSUserDefaults as constants at start-up, so the pairs can be read
// synchronously in a Release build with no native code and no config plugin.
function arg(key: string): string | undefined {
  const value = Settings.get(key);
  return value === undefined || value === null || value === '' ? undefined : String(value);
}

const screen = arg('screen');

export const launch = {
  screen: screen ?? 'book',
  state: arg('state'),
  passage: arg('passage'),
  // A launch that names a screen is a capture run: fixed sample data, saved preferences ignored.
  capture: screen !== undefined,
};
