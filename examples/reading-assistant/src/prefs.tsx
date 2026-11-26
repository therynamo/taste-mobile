import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Settings, useColorScheme } from 'react-native';
import { faces, palettes, type FaceId, type Palette, type TintId } from './tokens';
import { launch } from './launch';
import { seedKept } from './data';

// Preferences and kept answers persist in NSUserDefaults through React Native's Settings module.
const KEY = { face: 'mn.face', tint: 'mn.tint', haptics: 'mn.hapticsEnabled', kept: 'mn.kept' };

type Prefs = {
  c: Palette;
  dark: boolean;
  face: FaceId;
  family: string | undefined;
  tint: TintId;
  hapticsEnabled: boolean;
  kept: string[];
  setFace: (f: FaceId) => void;
  setTint: (t: TintId) => void;
  setHapticsEnabled: (on: boolean) => void;
  setKept: (id: string, keep: boolean) => void;
};

const Ctx = createContext<Prefs | null>(null);

function read<T>(key: string, fallback: T): T {
  const v = Settings.get(key);
  return v === undefined || v === null ? fallback : (v as T);
}

function initialKept(): string[] {
  if (launch.state === 'empty') return [];
  const raw = read<string | null>(KEY.kept, null);
  if (launch.capture || raw === null) return seedKept;
  return raw === '' ? [] : raw.split(',');
}

let hapticsOn = true;
export const hapticsEnabled = () => hapticsOn;

export function PrefsProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const [face, setFaceState] = useState<FaceId>(() => (launch.capture ? 'iowan' : read<FaceId>(KEY.face, 'iowan')));
  const [tint, setTintState] = useState<TintId>(() => (launch.capture ? 'system' : read<TintId>(KEY.tint, 'system')));
  const [haptics, setHapticsState] = useState<boolean>(() => Boolean(read<boolean | number>(KEY.haptics, true)));
  const [kept, setKeptState] = useState<string[]>(initialKept);
  hapticsOn = haptics;

  const setFace = useCallback((f: FaceId) => { setFaceState(f); Settings.set({ [KEY.face]: f }); }, []);
  const setTint = useCallback((t: TintId) => { setTintState(t); Settings.set({ [KEY.tint]: t }); }, []);
  const setHapticsEnabled = useCallback((on: boolean) => { setHapticsState(on); Settings.set({ [KEY.haptics]: on }); }, []);
  const setKept = useCallback((id: string, keep: boolean) => {
    setKeptState((prev) => {
      const next = keep ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((k) => k !== id);
      Settings.set({ [KEY.kept]: next.join(',') });
      return next;
    });
  }, []);

  const value = useMemo<Prefs>(() => {
    const resolved = tint === 'system' ? (scheme === 'dark' ? 'night' : 'bone') : tint;
    return {
      c: palettes[resolved],
      dark: resolved === 'night',
      face,
      family: faces.find((f) => f.id === face)?.family,
      tint,
      hapticsEnabled: haptics,
      kept,
      setFace,
      setTint,
      setHapticsEnabled,
      setKept,
    };
  }, [scheme, face, tint, haptics, kept, setFace, setTint, setHapticsEnabled, setKept]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): Prefs {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePrefs outside PrefsProvider');
  return v;
}
