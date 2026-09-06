import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import globleStyles from "../common/globleStyles";
import { colors, typography, radii } from '../common/theme';

function MaterialButtonDark(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.disabled && styles.disabled, props.style]}
      onPress={() => { props.onPress && props.onPress(); }}
      disabled={props.disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.caption}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    backgroundColor: colors.PRIMARY_DARK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radii.sm,
    shadowColor: colors.BLACK,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  caption: {
    ...typography.button,
    position: 'relative',
  }
});

export default MaterialButtonDark;
