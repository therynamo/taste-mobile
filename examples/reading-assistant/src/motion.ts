import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import { motion } from './tokens';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
}

// One way to move a value: a critically damped spring, or a short linear fade under Reduce Motion.
export function settle(value: Animated.Value, toValue: number, reduced: boolean, token: 'springDefault' | 'springEffects' = 'springDefault') {
  if (reduced) return Animated.timing(value, { toValue, duration: motion.reducedMs, useNativeDriver: true });
  return Animated.spring(value, { toValue, ...motion[token], useNativeDriver: true });
}
