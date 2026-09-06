import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { motion } from '../common/animations';

export default function AnimatedTabIcon({ name, focused, color, size = 24 }) {
  const scale = useRef(new Animated.Value(focused ? 1.08 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: focused ? 8 : 0,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
