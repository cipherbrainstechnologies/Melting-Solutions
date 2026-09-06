import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { landing } from '../common/landingTheme';
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ShowcaseSection from '../components/landing/ShowcaseSection';
import TrustSection from '../components/landing/TrustSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import LandingFooter from '../components/landing/LandingFooter';
import GrowthSection from '../components/landing/GrowthSection';
import { trackEvent, AnalyticsEvents } from '../common/analytics';

/**
 * Marketing landing — web AuthStack entry. Native continues to use Login.
 */
export default function Landing(props) {
  const scrollRef = useRef(null);
  const sectionY = useRef({});
  const [scrolled, setScrolled] = useState(false);

  const goRegister = useCallback(() => {
    trackEvent(AnalyticsEvents.CTA_REGISTER, { source: 'landing' });
    props.navigation.navigate('Register');
  }, [props.navigation]);

  const goLogin = useCallback(() => {
    trackEvent(AnalyticsEvents.CTA_LOGIN, { source: 'landing' });
    props.navigation.navigate('Login');
  }, [props.navigation]);

  useEffect(() => {
    trackEvent(AnalyticsEvents.LANDING_VIEW);
  }, []);

  const onSectionLayout = useCallback((id) => (e) => {
    sectionY.current[id] = e.nativeEvent.layout.y;
  }, []);

  const navigateSection = useCallback((id) => {
    if (id === 'hero') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = sectionY.current[id];
    if (typeof y === 'number') {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - landing.headerHeight + 4),
        animated: true,
      });
    }
  }, []);

  return (
    <View style={styles.root}>
      {Platform.OS === 'web' ? (
        <StatusBar barStyle="light-content" backgroundColor={landing.bg} />
      ) : null}

      <LandingHeader
        scrolled={scrolled}
        onNavigateSection={navigateSection}
        onPrimaryCta={goRegister}
        onSecondaryCta={goLogin}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          setScrolled(y > 20);
        }}
        scrollEventThrottle={16}
        accessibilityLabel="Melting Solution landing page"
      >
        <View style={styles.mesh} pointerEvents="none" />
        <View style={styles.noise} pointerEvents="none" />

        <View onLayout={onSectionLayout('hero')}>
          <HeroSection onPrimaryCta={goRegister} onSecondaryCta={goLogin} />
        </View>
        <View onLayout={onSectionLayout('features')}>
          <FeaturesSection />
        </View>
        <View onLayout={onSectionLayout('how')}>
          <HowItWorksSection />
        </View>
        <GrowthSection />
        <View onLayout={onSectionLayout('product')}>
          <ShowcaseSection />
        </View>
        <View onLayout={onSectionLayout('trust')}>
          <TrustSection />
        </View>
        <FinalCtaSection onPrimaryCta={goRegister} />
        <LandingFooter
          onNavigateSection={navigateSection}
          onSignIn={goLogin}
          onRegister={goRegister}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: landing.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
    position: 'relative',
  },
  mesh: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 520,
    backgroundColor: landing.accentSoft,
    opacity: 0.35,
  },
  noise: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
    // faint grid via repeating borders — RN-safe approximation
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
