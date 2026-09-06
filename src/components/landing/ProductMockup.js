import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { landing } from '../../common/landingTheme';
import { FontSemiBold, FontRegular, FontMedium } from '../../common/Constants';
import { colors } from '../../common/theme';

/**
 * CSS-accurate product mockup — no fake screenshots; mirrors real app surfaces.
 */
export default function ProductMockup() {
  return (
    <View style={styles.frame} accessibilityLabel="Product interface preview">
      <View style={styles.titleBar}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
          <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
          <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
        </View>
        <Text style={styles.url}>app · Melting Solution</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.sidebar}>
          <Text style={styles.sideItemActive}>Catalog</Text>
          <Text style={styles.sideItem}>Quotes</Text>
          <Text style={styles.sideItem}>Orders</Text>
          <Text style={styles.sideItem}>Chat</Text>
        </View>
        <View style={styles.main}>
          <Text style={styles.panelTitle}>Active quotes</Text>
          {[
            { id: '#MS-24018', status: 'Quote sent', tone: landing.accent },
            { id: '#MS-24012', status: 'Processing', tone: colors.GREEN },
            { id: '#MS-24007', status: 'Payment confirmed', tone: colors.SKY },
          ].map((row) => (
            <View key={row.id} style={styles.row}>
              <View>
                <Text style={styles.rowId}>{row.id}</Text>
                <Text style={styles.rowMeta}>Industrial materials · 3 line items</Text>
              </View>
              <View style={[styles.badge, { borderColor: row.tone }]}>
                <Text style={[styles.badgeText, { color: row.tone }]}>{row.status}</Text>
              </View>
            </View>
          ))}
          <View style={styles.chatPreview}>
            <Text style={styles.chatLabel}>Buyer ↔ Seller chat</Text>
            <Text style={styles.chatBubble}>Can you confirm delivery for next Tuesday?</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: landing.radiusLg,
    borderWidth: 1,
    borderColor: landing.glassBorder,
    backgroundColor: landing.bgElevated,
    overflow: 'hidden',
    minHeight: 320,
    ...Platform.select({
      web: {
        boxShadow: `0 30px 80px ${landing.accentGlow}`,
      },
      default: {
        shadowColor: landing.accent,
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 16 },
        elevation: 12,
      },
    }),
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: landing.glassBorder,
    backgroundColor: landing.graphite,
  },
  dots: { flexDirection: 'row', marginRight: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  url: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 12,
  },
  body: {
    flexDirection: 'row',
    minHeight: 280,
  },
  sidebar: {
    width: 110,
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: landing.glassBorder,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sideItem: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 13,
    marginBottom: 14,
  },
  sideItemActive: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 13,
    marginBottom: 14,
  },
  main: {
    flex: 1,
    padding: 16,
  },
  panelTitle: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowId: {
    color: landing.text,
    fontFamily: FontMedium,
    fontSize: 13,
  },
  rowMeta: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: FontMedium,
    fontSize: 10,
  },
  chatPreview: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: landing.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(42,83,216,0.35)',
  },
  chatLabel: {
    color: landing.textMuted,
    fontFamily: FontMedium,
    fontSize: 11,
    marginBottom: 6,
  },
  chatBubble: {
    color: landing.text,
    fontFamily: FontRegular,
    fontSize: 13,
    lineHeight: 18,
  },
});
