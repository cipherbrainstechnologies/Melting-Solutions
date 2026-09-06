import { colors } from './theme';

/**
 * Landing-only design tokens — dark luxury surface over existing brand accent.
 */
export const landing = {
  bg: '#07080C',
  bgElevated: '#0E1016',
  graphite: '#151822',
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassStrong: 'rgba(255,255,255,0.09)',
  text: '#F4F6FB',
  textMuted: 'rgba(244,246,251,0.68)',
  textDim: 'rgba(244,246,251,0.45)',
  accent: colors.PRIMARY_DARK, // #2A53D8
  accentSoft: 'rgba(42,83,216,0.22)',
  accentGlow: 'rgba(42,83,216,0.45)',
  navy: colors.DARK_BLUE,
  success: colors.GREEN,
  danger: colors.LIGHT_RED,
  radius: 16,
  radiusLg: 24,
  maxWidth: 1120,
  headerHeight: 68,
};

export const landingCopy = {
  brand: 'Melting Solution',
  tagline: 'Industrial sourcing, quote to delivery',
  heroHeadline: 'Source industrial materials with quote-first confidence',
  heroSub:
    'Browse catalog inventory, request quotes, negotiate in chat, confirm payment, and track fulfilment — one B2B workspace for buyers and sellers.',
  primaryCta: 'Get started',
  secondaryCta: 'Sign in',
  featuresTitle: 'Built for industrial commerce',
  featuresSub: 'Every capability maps to a real step in your quote-to-order workflow.',
  howTitle: 'How Melting Solution works',
  howSub: 'Three clear steps from discovery to delivery.',
  showcaseTitle: 'One product surface for buyers and admins',
  showcaseSub: 'Catalog, quotes, chat, and order timelines stay in sync across roles.',
  trustTitle: 'Trusted by procurement teams',
  trustSub: 'TODO: Add approved customer quotes and verified metrics before launch.',
  finalTitle: 'Start your next industrial quote today',
  finalSub: 'Create a buyer account in minutes and submit your first quote request.',
  finalCta: 'Create account',
};
