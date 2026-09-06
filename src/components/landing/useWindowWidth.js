import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export function useWindowWidth(breakpoint = 900) {
  const [width, setWidth] = useState(() => Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window }) => setWidth(window.width);
    // RN 0.64 API
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
    width,
    isDesktop: width >= breakpoint,
    isTablet: width >= 700 && width < breakpoint,
  };
}
