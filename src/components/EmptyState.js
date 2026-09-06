import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import globleStyles from '../common/globleStyles';
import { colors, spacing } from '../common/theme';
import FadeInView from './FadeInView';

export default function EmptyState({
  icon = 'folder-open-outline',
  title = 'Nothing here yet',
  description,
  style,
}) {
  return (
    <FadeInView style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={colors.PRIMARY_DARK} />
      </View>
      <Text style={globleStyles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={[globleStyles.screenDescription, styles.description]}>{description}</Text>
      ) : null}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
