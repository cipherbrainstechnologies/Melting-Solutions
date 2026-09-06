import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassCard from './GlassCard';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular } from '../../common/Constants';

export default function FinalCtaSection({ onPrimaryCta }) {
  return (
    <View style={styles.section}>
      <GlassCard elevated style={styles.panel}>
        <View style={styles.glow} pointerEvents="none" />
        <Text style={styles.title}>{landingCopy.finalTitle}</Text>
        <Text style={styles.sub}>{landingCopy.finalSub}</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={onPrimaryCta}
          accessibilityRole="button"
          accessibilityLabel={landingCopy.finalCta}
        >
          <Text style={styles.ctaText}>{landingCopy.finalCta}</Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  panel: {
    paddingVertical: 48,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderColor: 'rgba(42,83,216,0.35)',
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: landing.accentGlow,
    opacity: 0.2,
    top: -80,
    right: -40,
  },
  title: {
    color: landing.text,
    fontFamily: FontBold,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
    maxWidth: 480,
  },
  sub: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 420,
    lineHeight: 24,
  },
  cta: {
    backgroundColor: landing.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  ctaText: {
    color: '#fff',
    fontFamily: FontSemiBold,
    fontSize: 15,
  },
});
