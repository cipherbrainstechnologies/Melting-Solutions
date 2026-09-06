import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Dimensions, Animated, StyleSheet } from 'react-native';
import { colors } from '../common/theme';
import { motion } from '../common/animations';

const { width, height } = Dimensions.get('window');

export default function Spinner(props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: motion.fast,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.spinnerStyle, { opacity }]}>
      <View style={styles.card}>
        <ActivityIndicator size={props.size || 'large'} color={colors.PRIMARY_DARK} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
    backgroundColor: 'rgba(248,249,252,0.72)',
    left: 0,
    top: 0,
  },
  card: {
    backgroundColor: colors.WHITE,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
});
