import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  AccessibilityInfo,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { landing, landingCopy } from '../../common/landingTheme';
import { FontSemiBold, FontMedium } from '../../common/Constants';
import { useWindowWidth } from './useWindowWidth';

const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'product', label: 'Product' },
  { id: 'trust', label: 'Trust' },
];

export default function LandingHeader({
  scrolled,
  onNavigateSection,
  onPrimaryCta,
  onSecondaryCta,
}) {
  const { isDesktop } = useWindowWidth(900);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const solid = useRef(new Animated.Value(scrolled ? 1 : 0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    Animated.timing(solid, {
      toValue: scrolled ? 1 : 0,
      duration: reduceMotion ? 0 : 220,
      useNativeDriver: false,
    }).start();
  }, [scrolled, reduceMotion, solid]);

  const bg = solid.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(7,8,12,0)', 'rgba(14,16,22,0.94)'],
  });

  const closeAndGo = (id) => {
    setMenuOpen(false);
    onNavigateSection?.(id);
  };

  return (
    <Animated.View
      style={[
        styles.wrap,
        { backgroundColor: bg },
        scrolled && styles.scrolledBorder,
        Platform.OS === 'web' && scrolled && styles.webGlass,
      ]}
      accessibilityRole="header"
    >
      <View style={styles.inner}>
        <TouchableOpacity
          onPress={() => onNavigateSection?.('hero')}
          accessibilityRole="button"
          accessibilityLabel={`${landingCopy.brand} home`}
          style={styles.brandBtn}
        >
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logoMark}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.brand} numberOfLines={1}>{landingCopy.brand}</Text>
        </TouchableOpacity>

        {isDesktop ? (
          <View style={styles.desktopNav} accessibilityRole="navigation">
            {NAV.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onNavigateSection?.(item.id)}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                style={styles.navLink}
              >
                <Text style={styles.navText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          {isDesktop ? (
            <TouchableOpacity
              onPress={onSecondaryCta}
              accessibilityRole="button"
              accessibilityLabel={landingCopy.secondaryCta}
              style={styles.ghostBtn}
            >
              <Text style={styles.ghostText}>{landingCopy.secondaryCta}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={onPrimaryCta}
            accessibilityRole="button"
            accessibilityLabel={landingCopy.primaryCta}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryText}>{isDesktop ? landingCopy.primaryCta : 'Start'}</Text>
          </TouchableOpacity>
          {!isDesktop ? (
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              style={styles.menuBtn}
            >
              <Ionicons name="menu" size={24} color={landing.text} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Modal
        visible={menuOpen}
        animationType={reduceMotion ? 'none' : 'fade'}
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuOpen(false)}
          accessibilityLabel="Close menu backdrop"
        >
          <Pressable style={styles.menuSheet} accessibilityViewIsModal>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)} accessibilityRole="button" accessibilityLabel="Close menu">
                <Ionicons name="close" size={24} color={landing.text} />
              </TouchableOpacity>
            </View>
            {NAV.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => closeAndGo(item.id)}
                accessibilityRole="link"
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => { setMenuOpen(false); onSecondaryCta?.(); }}
              style={styles.menuItem}
              accessibilityRole="button"
            >
              <Text style={styles.menuItemText}>{landingCopy.secondaryCta}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setMenuOpen(false); onPrimaryCta?.(); }}
              style={styles.menuPrimary}
              accessibilityRole="button"
            >
              <Text style={styles.primaryText}>{landingCopy.primaryCta}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrolledBorder: {
    borderBottomWidth: 1,
    borderBottomColor: landing.glassBorder,
  },
  webGlass: Platform.OS === 'web' ? {
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  } : {},
  inner: {
    maxWidth: landing.maxWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    height: landing.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandBtn: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
  },
  brand: { color: landing.text, fontFamily: FontSemiBold, fontSize: 15, maxWidth: 160 },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: { paddingHorizontal: 12, paddingVertical: 8 },
  navText: { color: landing.textMuted, fontFamily: FontMedium, fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  ghostBtn: { paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  ghostText: { color: landing.textMuted, fontFamily: FontMedium, fontSize: 14 },
  primaryBtn: {
    backgroundColor: landing.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryText: { color: '#fff', fontFamily: FontSemiBold, fontSize: 14 },
  menuBtn: { marginLeft: 10, padding: 6 },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-start',
  },
  menuSheet: {
    backgroundColor: landing.bgElevated,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: landing.glassBorder,
    padding: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: { color: landing.text, fontFamily: FontSemiBold, fontSize: 18 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: landing.glassBorder },
  menuItemText: { color: landing.text, fontFamily: FontMedium, fontSize: 16 },
  menuPrimary: {
    marginTop: 16,
    backgroundColor: landing.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
