import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from './GlassCard';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular, FontMedium } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

/**
 * Trust layout only — no invented metrics or testimonials.
 * Replace TODO placeholders when approved content exists.
 */
export default function TrustSection({ sectionRef }) {
  const { isDesktop } = useWindowWidth(800);

  return (
    <View ref={sectionRef} style={styles.section} nativeID="trust">
      <Text style={styles.title}>{landingCopy.trustTitle}</Text>
      <Text style={styles.sub}>{landingCopy.trustSub}</Text>

      <View style={[styles.row, !isDesktop && styles.col]}>
        <GlassCard style={[styles.card, isDesktop && styles.cardFlex]}>
          <Text style={styles.label}>TODO: Metric</Text>
          <Text style={styles.placeholder}>
            TODO: Add an approved KPI (e.g. quotes processed) — do not publish unverified numbers.
          </Text>
        </GlassCard>
        <GlassCard style={[styles.card, isDesktop && styles.cardFlex]}>
          <Text style={styles.label}>TODO: Testimonial</Text>
          <Text style={styles.placeholder}>
            TODO: Insert a real customer quote with name, role, and company once approved.
          </Text>
        </GlassCard>
        <GlassCard style={[styles.card, isDesktop && styles.cardFlex]}>
          <Text style={styles.label}>What we can state today</Text>
          <Text style={styles.fact}>
            Quote-to-order workflow with catalog, chat, delivery addresses, and admin reporting — built into the live product.
          </Text>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 72,
    paddingHorizontal: 20,
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    color: landing.text,
    fontFamily: FontBold,
    fontSize: 32,
    marginBottom: 10,
  },
  sub: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: 640,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flexDirection: 'column',
  },
  card: {
    marginBottom: 14,
    marginRight: 12,
    minHeight: 140,
  },
  cardFlex: {
    flex: 1,
  },
  label: {
    color: landing.accent,
    fontFamily: FontMedium,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  placeholder: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 14,
    lineHeight: 21,
  },
  fact: {
    color: landing.textMuted,
    fontFamily: FontSemiBold,
    fontSize: 15,
    lineHeight: 22,
  },
});
