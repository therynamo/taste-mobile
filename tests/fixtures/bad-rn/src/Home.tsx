import React from 'react';
import { Alert, Animated, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import ReAnimated, { Easing, FadeInDown, ReduceMotion, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export function Home({ items, offset }) {
  const y = withSpring(offset);
  const fade = withTiming(1, { duration: 900, easing: Easing.in(Easing.quad), reduceMotion: ReduceMotion.Never });
  return (
    <ScrollView
      onScroll={() => {
        Haptics.selectionAsync();
      }}
    >
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={{ paddingTop: 50 }}>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 9 }} allowFontScaling={false}>Welcome back, John Doe 👋</Text>
      </LinearGradient>
      {items.map((item, index) => (
        <ReAnimated.View key={item.id} entering={FadeInDown.delay(index * 100)} style={{ transform: [{ scale: 0 }] }}>
          <Text onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
            {'-$' + item.amount}
          </Text>
        </ReAnimated.View>
      ))}
      <Text onPress={() => Alert.alert('Success', 'Saved')}>✨ Summarise</Text>
      <Text onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}>🔥 12 day streak</Text>
    </ScrollView>
  );
}

export function legacy(v) {
  Animated.timing(v, { toValue: 1, duration: 200, useNativeDriver: true }).start();
}
