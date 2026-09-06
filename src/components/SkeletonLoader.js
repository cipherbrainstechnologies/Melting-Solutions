import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii } from '../common/theme';

function SkeletonBox({ width, height, style, borderRadius = radii.sm }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.box,
        { width, height, borderRadius, opacity: pulse },
        style,
      ]}
    />
  );
}

export function SkeletonGrid({ columns = 2, count = 4, cardWidth, cardHeight }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBox
          key={index}
          width={cardWidth}
          height={cardHeight || cardWidth}
          borderRadius={radii.lg}
          style={{ marginBottom: 10, marginRight: (index + 1) % columns === 0 ? 0 : 10 }}
        />
      ))}
    </View>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listRow}>
          <SkeletonBox width={72} height={72} borderRadius={radii.md} />
          <View style={styles.listContent}>
            <SkeletonBox width="60%" height={14} style={{ marginBottom: 8 }} />
            <SkeletonBox width="40%" height={12} style={{ marginBottom: 8 }} />
            <SkeletonBox width="80%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function SkeletonDashboard({ columns = 2, count = 6, cardWidth, cardHeight }) {
  return <SkeletonGrid columns={columns} count={count} cardWidth={cardWidth} cardHeight={cardHeight} />;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.GREY_3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listRow: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.BORDER,
    backgroundColor: colors.WHITE,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});

export default SkeletonBox;
