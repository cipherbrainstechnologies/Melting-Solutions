import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular, FontMedium } from '../../common/Constants';
import ProductMockup from './ProductMockup';
import { useWindowWidth } from './useWindowWidth';

export default function HeroSection({ onPrimaryCta, onSecondaryCta, sectionRef }) {
  const { isDesktop } = useWindowWidth(900);

  return (
    <View
      ref={sectionRef}
      style={styles.section}
      accessibilityRole="header"
      nativeID="hero"
    >
      <View style={styles.glow} pointerEvents="none" />
      <View style={styles.grid} pointerEvents="none" />

      <View style={[styles.content, isDesktop && styles.contentRow]}>
        <View style={[styles.copy, isDesktop && { flex: 1.05, paddingRight: 28 }]}>
          <Text style={styles.eyebrow}>{landingCopy.tagline}</Text>
          <Text style={styles.headline} accessibilityRole="header">
            {landingCopy.heroHeadline}
          </Text>
          <Text style={styles.sub}>{landingCopy.heroSub}</Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primary}
              onPress={onPrimaryCta}
              accessibilityRole="button"
              accessibilityLabel={landingCopy.primaryCta}
            >
              <Text style={styles.primaryText}>{landingCopy.primaryCta}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondary}
              onPress={onSecondaryCta}
              accessibilityRole="button"
              accessibilityLabel={landingCopy.secondaryCta}
            >
              <Text style={styles.secondaryText}>{landingCopy.secondaryCta}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trustRow} accessibilityRole="summary">
            <Text style={styles.trustItem}>Quote-first buying</Text>
            <Text style={styles.trustDot}>·</Text>
            <Text style={styles.trustItem}>Buyer & admin roles</Text>
            <Text style={styles.trustDot}>·</Text>
            <Text style={styles.trustItem}>In-app chat</Text>
          </View>
        </View>

        <View style={[styles.visual, isDesktop && { flex: 1 }]}>
          <ProductMockup />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: landing.headerHeight + 36,
    paddingBottom: 64,
    paddingHorizontal: 20,
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 40,
    right: -40,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: landing.accentGlow,
    opacity: 0.28,
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.08,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    marginBottom: 32,
  },
  eyebrow: {
    color: landing.accent,
    fontFamily: FontMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  headline: {
    color: landing.text,
    fontFamily: FontBold,
    fontSize: 40,
    lineHeight: 48,
    marginBottom: 16,
  },
  sub: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 28,
    maxWidth: 520,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
  },
  primary: {
    backgroundColor: landing.accent,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    marginRight: 12,
    marginBottom: 10,
  },
  primaryText: { color: '#fff', fontFamily: FontSemiBold, fontSize: 15 },
  secondary: {
    borderWidth: 1,
    borderColor: landing.glassBorder,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    marginBottom: 10,
    backgroundColor: landing.glass,
  },
  secondaryText: { color: landing.text, fontFamily: FontSemiBold, fontSize: 15 },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  trustItem: {
    color: landing.textDim,
    fontFamily: FontMedium,
    fontSize: 12,
  },
  trustDot: {
    color: landing.textDim,
    marginHorizontal: 8,
  },
  visual: {
    width: '100%',
  },
});
