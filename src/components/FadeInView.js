import React, { useEffect, useRef, useState } from 'react';
import { Animated, AccessibilityInfo } from 'react-native';
import { motion } from '../common/animations';

export default function FadeInView({
  children,
  delay = 0,
  duration = motion.normal,
  style,
  translateY = 12,
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(translateY)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    const animDuration = reduceMotion ? 0 : duration;
    const animDelay = reduceMotion ? 0 : delay;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: animDuration,
        delay: animDelay,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: animDuration,
        delay: animDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, opacity, reduceMotion, translate, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY: translate }] }]}>
      {children}
    </Animated.View>
  );
}
