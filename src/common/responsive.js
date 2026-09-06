import { Dimensions, Platform } from 'react-native';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');

export const breakpoints = {
  mobile: 0,
  tablet: 700,
  desktop: 900,
  wide: 1200,
};

export const layout = {
  screenPadding: width >= breakpoints.desktop ? 32 : width >= breakpoints.tablet ? 24 : 16,
  contentMaxWidth: 720,
  formMaxWidth: 480,
  cardMaxWidth: 960,
};

export function getDeviceType(screenWidth = width) {
  if (screenWidth >= breakpoints.desktop) return 'desktop';
  if (screenWidth >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

export function getContentWidth(screenWidth = width, maxWidth = layout.contentMaxWidth) {
  const horizontalPadding = layout.screenPadding * 2;
  return Math.min(screenWidth - horizontalPadding, maxWidth);
}

export function getGridColumns(screenWidth = width) {
  if (screenWidth >= breakpoints.desktop) return 3;
  if (screenWidth >= breakpoints.tablet) return 2;
  return 1;
}

export const isWeb = Platform.OS === 'web';

export function useWindowWidth(breakpoint = breakpoints.desktop) {
  const [screenWidth, setScreenWidth] = useState(() => Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window }) => setScreenWidth(window.width);
    Dimensions.addEventListener('change', onChange);
    return () => {
      try {
        Dimensions.removeEventListener('change', onChange);
      } catch (_) {
        // no-op
      }
    };
  }, []);

  return {
    width: screenWidth,
    isDesktop: screenWidth >= breakpoint,
    isTablet: screenWidth >= breakpoints.tablet && screenWidth < breakpoint,
    isMobile: screenWidth < breakpoints.tablet,
  };
}

export { width, height };
