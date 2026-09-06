import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontMedium, FontRegular, FontSemiBold } from '../../common/Constants';
import GlassCard from './GlassCard';
import { useWindowWidth } from './useWindowWidth';

const METRICS = [
  { value: '4-step', label: 'Quote workflow', hint: 'Browse → quote → chat → delivery' },
  { value: '2 roles', label: 'Buyer & admin', hint: 'One platform, role-based access' },
  { value: '24/7', label: 'Catalog access', hint: 'Buyers discover products anytime' },
];

export default function GrowthSection() {
  const { isDesktop } = useWindowWidth(900);

  return (
    <View style={styles.section} nativeID="growth">
      <Text style={styles.eyebrow}>{landingCopy.growthTitle}</Text>
      <Text style={styles.title}>{landingCopy.growthHeadline}</Text>
      <Text style={styles.sub}>{landingCopy.growthSub}</Text>

      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {METRICS.map((metric) => (
          <GlassCard key={metric.label} style={styles.card}>
            <Text style={styles.value}>{metric.value}</Text>
            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.hint}>{metric.hint}</Text>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 56,
    paddingHorizontal: 20,
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  eyebrow: {
    color: landing.accent,
    fontFamily: FontMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: landing.text,
    fontFamily: FontBold,
    fontSize: 30,
    lineHeight: 38,
    marginBottom: 12,
    maxWidth: 560,
  },
  sub: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: 560,
  },
  grid: {
    marginBottom: 0,
  },
  gridDesktop: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    padding: 22,
    minWidth: 180,
    marginBottom: 14,
    marginRight: 14,
  },
  value: {
    color: landing.text,
    fontFamily: FontBold,
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 15,
    marginBottom: 6,
  },
  hint: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 13,
    lineHeight: 18,
  },
});
