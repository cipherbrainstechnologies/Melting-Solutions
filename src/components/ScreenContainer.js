import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../common/theme';
import { layout } from '../common/responsive';

export default function ScreenContainer({
  children,
  scroll = false,
  maxWidth = layout.contentMaxWidth,
  style,
  contentStyle,
}) {
  const containerStyle = [
    styles.container,
    { paddingHorizontal: layout.screenPadding },
    style,
  ];

  const innerStyle = [
    styles.inner,
    { maxWidth, width: '100%', alignSelf: 'center' },
    contentStyle,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[containerStyle, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={innerStyle}>{children}</View>
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={innerStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  inner: {
    flex: 1,
  },
});
