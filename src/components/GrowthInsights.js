import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import globleStyles from '../common/globleStyles';
import { colors, radii, shadows } from '../common/theme';
import FadeInView from './FadeInView';
import PressableCard from './PressableCard';

function MetricCard({ label, value, hint, icon, onPress }) {
  const content = (
    <View style={styles.metric}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={18} color={colors.PRIMARY_DARK} style={{ marginRight: 6 }} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {hint ? <Text style={styles.metricHint}>{hint}</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <PressableCard onPress={onPress} style={styles.metricCard}>
        {content}
      </PressableCard>
    );
  }

  return <View style={styles.metricCard}>{content}</View>;
}

export default function GrowthInsights({
  newUsersWeek = 0,
  activeUsers = 0,
  pendingQuotes = 0,
  onAddUser,
  onBroadcast,
  onAddProduct,
}) {
  return (
    <FadeInView style={styles.wrap}>
      <Text style={globleStyles.sectionTitle}>Growth snapshot</Text>
      <Text style={[globleStyles.screenDescription, styles.subtitle]}>
        Signals to help you acquire and activate more buyers.
      </Text>

      <View style={styles.metricsRow}>
        <MetricCard
          icon="person-add-outline"
          label="New buyers (7d)"
          value={String(newUsersWeek)}
          hint="Recently registered accounts"
        />
        <MetricCard
          icon="pulse-outline"
          label="Active buyers"
          value={String(activeUsers)}
          hint="Accounts with active status"
        />
        <MetricCard
          icon="time-outline"
          label="Pending quotes"
          value={String(pendingQuotes)}
          hint="Awaiting your response"
        />
      </View>

      <Text style={styles.actionsTitle}>Quick growth actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionChip} onPress={onAddUser}>
          <Ionicons name="person-add-outline" size={16} color={colors.PRIMARY_DARK} />
          <Text style={styles.actionText}>Add buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionChip} onPress={onAddProduct}>
          <Ionicons name="cube-outline" size={16} color={colors.PRIMARY_DARK} />
          <Text style={styles.actionText}>Add product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionChip} onPress={onBroadcast}>
          <Ionicons name="radio-outline" size={16} color={colors.PRIMARY_DARK} />
          <Text style={styles.actionText}>Broadcast</Text>
        </TouchableOpacity>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  subtitle: { marginBottom: 12 },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: colors.WHITE,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.BORDER,
    padding: 14,
    marginRight: 10,
    marginBottom: 10,
    ...shadows.card,
  },
  metric: {},
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    ...globleStyles.cardTextLabel,
    textTransform: 'none',
    fontSize: 12,
  },
  metricValue: {
    ...globleStyles.subHeader,
    fontSize: 26,
    marginBottom: 4,
  },
  metricHint: {
    ...globleStyles.normalText,
    fontSize: 12,
  },
  actionsTitle: {
    ...globleStyles.fontSemiBold,
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderColor: 'rgba(42,83,216,0.15)',
    marginRight: 8,
    marginBottom: 8,
  },
  actionText: {
    ...globleStyles.fontSemiBold,
    fontSize: 13,
    color: colors.PRIMARY_DARK,
  },
});
