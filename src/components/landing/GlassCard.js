import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { landing } from '../../common/landingTheme';

export default function GlassCard({ children, style, elevated }) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        Platform.OS === 'web' && styles.webBlur,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: landing.glass,
    borderWidth: 1,
    borderColor: landing.glassBorder,
    borderRadius: landing.radius,
    padding: 20,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: landing.glassStrong,
  },
  webBlur: Platform.OS === 'web' ? {
    // @ts-ignore web-only
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  } : {},
});
