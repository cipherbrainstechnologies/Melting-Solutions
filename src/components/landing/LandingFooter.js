import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontSemiBold, FontRegular, FontMedium } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

const FOOTER_NAV = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'product', label: 'Product' },
  { id: 'trust', label: 'Trust' },
];

export default function LandingFooter({ onNavigateSection, onSignIn, onRegister }) {
  const { isDesktop } = useWindowWidth(700);
  const year = new Date().getFullYear();

  return (
    <View style={styles.footer} accessibilityRole="contentinfo">
      <View style={[styles.inner, !isDesktop && styles.innerCol]}>
        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logo}
              accessibilityLabel={`${landingCopy.brand} logo`}
            />
            <Text style={styles.brand}>{landingCopy.brand}</Text>
          </View>
          <Text style={styles.tag}>{landingCopy.tagline}</Text>
        </View>

        <View style={styles.navCol} accessibilityRole="navigation">
          <Text style={styles.colTitle}>Product</Text>
          {FOOTER_NAV.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onNavigateSection?.(item.id)}
              accessibilityRole="link"
              accessibilityLabel={item.label}
              style={styles.link}
            >
              <Text style={styles.linkText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navCol}>
          <Text style={styles.colTitle}>Account</Text>
          <TouchableOpacity onPress={onSignIn} accessibilityRole="link" style={styles.link}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRegister} accessibilityRole="link" style={styles.link}>
            <Text style={styles.linkText}>Create account</Text>
          </TouchableOpacity>
          {/* TODO: Add Privacy Policy / Terms URLs when published */}
          <Text style={styles.todo}>TODO: Privacy & Terms links</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copy}>
          © {year} {landingCopy.brand}. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: landing.glassBorder,
    backgroundColor: landing.bgElevated,
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  inner: {
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  innerCol: {
    flexDirection: 'column',
  },
  brandBlock: {
    marginBottom: 24,
    maxWidth: 280,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 10,
  },
  brand: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 15,
  },
  tag: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 13,
    lineHeight: 19,
  },
  navCol: {
    marginBottom: 20,
    minWidth: 140,
  },
  colTitle: {
    color: landing.text,
    fontFamily: FontSemiBold,
    fontSize: 13,
    marginBottom: 12,
  },
  link: {
    paddingVertical: 6,
  },
  linkText: {
    color: landing.textMuted,
    fontFamily: FontMedium,
    fontSize: 14,
  },
  todo: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 12,
    marginTop: 10,
  },
  bottom: {
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderTopColor: landing.glassBorder,
    paddingTop: 18,
  },
  copy: {
    color: landing.textDim,
    fontFamily: FontRegular,
    fontSize: 12,
  },
});
