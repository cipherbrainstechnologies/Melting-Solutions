import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import GlassCard from './GlassCard';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

const FEATURES = [
  {
    icon: 'search-outline',
    title: 'Industrial product catalog',
    body: 'Browse and search live inventory with quantities, specs, and expected delivery dates before you request a quote.',
  },
  {
    icon: 'document-text-outline',
    title: 'Quote-first sourcing',
    body: 'Submit cart-based quote requests instead of blind checkout — sellers respond with pricing you can accept or refine.',
  },
  {
    icon: 'chatbubbles-outline',
    title: 'Buyer–seller chat',
    body: 'Discuss terms on each quote or order thread so negotiation stays attached to the commercial record.',
  },
  {
    icon: 'git-branch-outline',
    title: 'Order lifecycle tracking',
    body: 'Follow status from quote requested → quote sent → payment confirmed → processing → delivered.',
  },
  {
    icon: 'location-outline',
    title: 'Delivery locations',
    body: 'Save work and site addresses with map-assisted pin placement for accurate fulfilment.',
  },
  {
    icon: 'grid-outline',
    title: 'Admin operations desk',
    body: 'Sellers manage users, products, quote responses, reports export, and notification broadcasts from one console.',
  },
];

export default function FeaturesSection({ sectionRef }) {
  const { width, isDesktop } = useWindowWidth(900);
  const cols = width >= 900 ? 3 : width >= 640 ? 2 : 1;

  return (
    <View ref={sectionRef} style={styles.section} nativeID="features" accessibilityRole="summary">
      <Text style={styles.title}>{landingCopy.featuresTitle}</Text>
      <Text style={styles.sub}>{landingCopy.featuresSub}</Text>
      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {FEATURES.map((f) => (
          <View key={f.title} style={[styles.cell, { width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31%' }]}>
            <GlassCard style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name={f.icon} size={22} color={landing.accent} />
              </View>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardBody}>{f.body}</Text>
            </GlassCard>
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
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: 560,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridDesktop: {},
  cell: {
    marginBottom: 16,
  },
  card: {
    minHeight: 180,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: landing.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 17,
    marginBottom: 8,
  },
  cardBody: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 14,
    lineHeight: 21,
  },
});
