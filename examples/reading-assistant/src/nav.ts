import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AnswerMode = 'settled' | 'stream' | 'frozen' | 'error';

export type Routes = {
  Book: undefined;
  Passage: { answerId: string; passage: number }; // passage is 1-based
  Answer: { answerId?: string; question?: string; mode: AnswerMode };
  Kept: undefined;
  Type: undefined;
};

export type ScreenProps<T extends keyof Routes> = NativeStackScreenProps<Routes, T>;
