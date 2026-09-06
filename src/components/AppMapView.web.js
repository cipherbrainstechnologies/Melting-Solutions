import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../common/theme';
import globleStyles from '../common/globleStyles';

/**
 * Web fallback for react-native-maps.
 * Shows coordinates + OpenStreetMap embed; pin drag is not supported on web.
 */
export default function AppMapView({
  style,
  region,
  initialRegion,
  onRegionChangeComplete,
  children,
  ...rest
}) {
  const r = region || initialRegion || { latitude: 0, longitude: 0, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  const lat = Number(r.latitude) || 0;
  const lng = Number(r.longitude) || 0;
  const delta = Math.max(Number(r.latitudeDelta) || 0.05, 0.01);
  const zoom = Math.min(18, Math.max(3, Math.round(Math.log2(360 / delta))));

  const bboxPad = delta;
  const left = lng - bboxPad;
  const right = lng + bboxPad;
  const top = lat + bboxPad;
  const bottom = lat - bboxPad;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'web' ? (
        <iframe
          title="Delivery map"
          src={embedUrl}
          style={{ border: 0, width: '100%', height: '100%', borderRadius: 8 }}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={globleStyles.normalText}>Map unavailable</Text>
        </View>
      )}
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.coords}>
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </Text>
      </View>
      {children}
    </View>
  );
}

export const Marker = () => null;
export const PROVIDER_GOOGLE = null;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.GREY_3 || '#eee',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  coords: {
    fontSize: 12,
    color: '#333',
  },
});
