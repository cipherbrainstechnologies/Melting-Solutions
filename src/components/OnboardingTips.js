import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import globleStyles from '../common/globleStyles';
import { colors, radii, shadows } from '../common/theme';
import MaterialButtonDark from './MaterialButtonDark';
import { getItem, setItem } from '../common/storage';
import { trackEvent, AnalyticsEvents } from '../common/analytics';

const BUYER_STEPS = [
  { icon: 'search-outline', title: 'Browse the catalog', body: 'Explore industrial products and compare options in one place.' },
  { icon: 'cart-outline', title: 'Build your quote cart', body: 'Add items, set quantities, and submit a quote request in minutes.' },
  { icon: 'chatbubbles-outline', title: 'Negotiate in chat', body: 'Discuss pricing and timelines directly with the seller team.' },
  { icon: 'checkmark-circle-outline', title: 'Track to delivery', body: 'Follow quote acceptance, payment, and order completion.' },
];

const ADMIN_STEPS = [
  { icon: 'people-outline', title: 'Grow your buyer base', body: 'Add users with passwords and keep accounts active from Users.' },
  { icon: 'cube-outline', title: 'Keep catalog fresh', body: 'Publish products buyers can discover and request quotes on.' },
  { icon: 'paper-plane-outline', title: 'Respond to quotes fast', body: 'Speed wins deals — send quotes from Orders and chat in-app.' },
  { icon: 'radio-outline', title: 'Re-engage buyers', body: 'Use broadcast notifications to announce new stock or offers.' },
];

export default function OnboardingTips({ role = 'user', storageKey, onComplete }) {
  const [visible, setVisible] = useState(false);
  const steps = role === 'admin' ? ADMIN_STEPS : BUYER_STEPS;

  useEffect(() => {
    let mounted = true;
    getItem(storageKey).then((value) => {
      if (mounted && !value) setVisible(true);
    });
    return () => { mounted = false; };
  }, [storageKey]);

  const finish = async () => {
    await setItem(storageKey, '1');
    trackEvent(AnalyticsEvents.ONBOARDING_COMPLETE, { role });
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={finish}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>
            {role === 'admin' ? 'Welcome to your admin workspace' : 'Welcome to Melting Solution'}
          </Text>
          <Text style={styles.subheading}>
            {role === 'admin'
              ? 'Here is how to drive growth from day one.'
              : 'Your quote-to-order workflow in four simple steps.'}
          </Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {steps.map((step, index) => (
              <View key={step.title} style={styles.step}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={20} color={colors.PRIMARY_DARK} />
                </View>
                <View style={styles.stepCopy}>
                  <Text style={styles.stepTitle}>{index + 1}. {step.title}</Text>
                  <Text style={styles.stepBody}>{step.body}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <MaterialButtonDark onPress={finish}>Get started</MaterialButtonDark>
          <TouchableOpacity onPress={finish} style={styles.skip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,29,38,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.WHITE,
    borderRadius: radii.lg,
    padding: 24,
    maxHeight: '85%',
    ...shadows.elevated,
  },
  heading: {
    ...globleStyles.subHeader,
    fontSize: 22,
    marginBottom: 6,
  },
  subheading: {
    ...globleStyles.screenDescription,
    marginBottom: 16,
  },
  list: { marginBottom: 8 },
  step: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCopy: { flex: 1 },
  stepTitle: {
    ...globleStyles.fontSemiBold,
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  stepBody: {
    ...globleStyles.normalText,
    fontSize: 13,
    lineHeight: 18,
  },
  skip: { alignSelf: 'center', paddingVertical: 10 },
  skipText: {
    ...globleStyles.normalText,
    color: colors.TEXT_SECONDARY,
  },
});
