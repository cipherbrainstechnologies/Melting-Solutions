import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import GlassCard from './GlassCard';
import ProductMockup from './ProductMockup';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontBold, FontSemiBold, FontRegular } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

const HIGHLIGHTS = [
  {
    title: 'Catalog & search',
    body: 'Live product listings with quantity and expected delivery fields before quote submission.',
  },
  {
    title: 'Quotes & orders',
    body: 'Status-aware quote and order boards for buyers, with admin tools to price and advance fulfilment.',
  },
  {
    title: 'Chat on the record',
    body: 'Threaded conversation tied to quotes and orders so commercial context never leaves the workspace.',
  },
];

export default function ShowcaseSection({ sectionRef }) {
  const { isDesktop } = useWindowWidth(900);
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <View ref={sectionRef} style={styles.section} nativeID="product">
      <Text style={styles.title}>{landingCopy.showcaseTitle}</Text>
      <Text style={styles.sub}>{landingCopy.showcaseSub}</Text>

      <View style={[styles.layout, isDesktop && styles.layoutRow]}>
        <View style={[styles.mockWrap, isDesktop && { flex: 1.15 }]}>
          <ProductMockup />
        </View>
        <View style={[styles.list, isDesktop && { flex: 0.85, marginLeft: 24 }]}>
          {HIGHLIGHTS.map((h, i) => (
            <View
              key={h.title}
              // @ts-ignore web mouse events
              onMouseEnter={Platform.OS === 'web' ? () => setHoverIndex(i) : undefined}
              onMouseLeave={Platform.OS === 'web' ? () => setHoverIndex(null) : undefined}
            >
              <GlassCard
                elevated={hoverIndex === i}
                style={[
                  styles.card,
                  hoverIndex === i && styles.cardHover,
                  Platform.OS === 'web' && styles.cardWeb,
                ]}
              >
                <Text style={styles.cardTitle}>{h.title}</Text>
                <Text style={styles.cardBody}>{h.body}</Text>
              </GlassCard>
            </View>
          ))}
        </View>
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
  layout: {
    width: '100%',
  },
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mockWrap: {
    marginBottom: 24,
  },
  list: {
    width: '100%',
  },
  card: {
    marginBottom: 12,
  },
  cardHover: {
    borderColor: 'rgba(42,83,216,0.45)',
  },
  cardWeb: Platform.OS === 'web' ? {
    transitionProperty: 'border-color, transform',
    transitionDuration: '180ms',
  } : {},
  cardTitle: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 16,
    marginBottom: 6,
  },
  cardBody: {
    color: landing.textMuted,
    fontFamily: FontRegular,
    fontSize: 14,
    lineHeight: 21,
  },
});
