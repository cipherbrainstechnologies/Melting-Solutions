import { AccessibilityInfo } from 'react-native';

export const motion = {
  fast: 150,
  normal: 220,
  slow: 320,
  stagger: 60,
};

export const spring = {
  damping: 14,
  stiffness: 180,
};

export async function shouldReduceMotion() {
  try {
    const enabled = await AccessibilityInfo.isReduceMotionEnabled?.();
    return Boolean(enabled);
  } catch (_) {
    return false;
  }
}
