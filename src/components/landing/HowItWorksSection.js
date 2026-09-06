import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from './GlassCard';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

const STEPS = [
  {
    step: '01',
    title: 'Discover & shortlist',
    body: 'Search the catalog, set quantity and expected date, and add items to your quote cart.',
  },
  {
    step: '02',
    title: 'Request & negotiate',
    body: 'Submit a quote with delivery address. Sellers reply with pricing; chat to clarify terms.',
  },
  {
    step: '03',
    title: 'Confirm & fulfil',
    body: 'Accept with manual payment reference, then track processing through to delivery completion.',
  },
];

export default function HowItWorksSection({ sectionRef }) {
  const { isDesktop } = useWindowWidth(800);

  return (
    <View ref={sectionRef} style={styles.section} nativeID="how">
      <Text style={styles.title}>{landingCopy.howTitle}</Text>
      <Text style={styles.sub}>{landingCopy.howSub}</Text>
      <View style={[styles.row, !isDesktop && styles.col]}>
        {STEPS.map((s, i) => (
          <View key={s.step} style={[styles.stepWrap, isDesktop && { flex: 1 }]}>
            <GlassCard elevated style={styles.card}>
              <Text style={styles.stepNum}>{s.step}</Text>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepBody}>{s.body}</Text>
            </GlassCard>
            {isDesktop && i < STEPS.length - 1 ? <View style={styles.connector} /> : null}
          </View>
        ))}
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
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  col: {
    flexDirection: 'column',
  },
  stepWrap: {
    position: 'relative',
    marginBottom: 14,
    marginRight: 12,
  },
  card: {
    minHeight: 190,
  },
  stepNum: {
    color: landing.accent,
    fontFamily: FontBold,
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 12,
  },
  stepTitle: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 18,
    marginBottom: 8,
  },
  stepBody: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 14,
    lineHeight: 21,
  },
  connector: {
    position: 'absolute',
    right: -8,
    top: '45%',
    width: 16,
    height: 2,
    backgroundColor: landing.accentSoft,
  },
});
