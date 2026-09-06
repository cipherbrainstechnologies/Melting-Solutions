import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import globleStyles from '../common/globleStyles';
import { colors, radii, shadows } from '../common/theme';
import FadeInView from './FadeInView';

export default function GrowthBanner({
  title,
  description,
  ctaLabel,
  onPress,
  onDismiss,
  icon = 'rocket-outline',
  variant = 'primary',
}) {
  const isPrimary = variant === 'primary';

  return (
    <FadeInView style={styles.wrap}>
      <View style={[styles.banner, isPrimary ? styles.bannerPrimary : styles.bannerNeutral]}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={22} color={isPrimary ? colors.PRIMARY_DARK : colors.TEXT_SECONDARY} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {ctaLabel && onPress ? (
            <TouchableOpacity onPress={onPress} style={styles.cta} activeOpacity={0.85}>
              <Text style={styles.ctaText}>{ctaLabel}</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.PRIMARY_DARK} />
            </TouchableOpacity>
          ) : null}
        </View>
        {onDismiss ? (
          <TouchableOpacity onPress={onDismiss} style={styles.dismiss} accessibilityLabel="Dismiss">
            <Ionicons name="close" size={18} color={colors.TEXT_SECONDARY} />
          </TouchableOpacity>
        ) : null}
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  banner: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    padding: 16,
    borderWidth: 1,
    ...shadows.card,
  },
  bannerPrimary: {
    backgroundColor: colors.PRIMARY_LIGHT,
    borderColor: 'rgba(42,83,216,0.2)',
  },
  bannerNeutral: {
    backgroundColor: colors.WHITE,
    borderColor: colors.BORDER,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  copy: { flex: 1 },
  title: {
    ...globleStyles.fontSemiBold,
    fontSize: 15,
    color: colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  description: {
    ...globleStyles.normalText,
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  ctaText: {
    ...globleStyles.fontSemiBold,
    fontSize: 13,
    color: colors.PRIMARY_DARK,
  },
  dismiss: {
    padding: 4,
    marginLeft: 4,
  },
});
