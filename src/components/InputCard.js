/* @flow weak */

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import globleStyles from '../common/globleStyles';
import { colors, typography, radii } from '../common/theme';

class InputCard extends Component {
  render() {
    const { editable, onChangeText, blurOnSubmit, maxLength, label, value, returnKey, placeholder,
      keyboardType, children, multiline, secureEntry, inputRef, onSubmitEditing, rightIcon, onPressRightIcon, textInputStyle, cardInputStyle } = this.props;

    return (<>
      {label && <Text style={[inputCardStyle.inputCardItemLabel, globleStyles.fontSemiBold]}>{label}</Text>}
      <View style={[inputCardStyle.inputCardItem, cardInputStyle]}>
        {children}
        <View style={{ flex: 1, }}>
          <View style={inputCardStyle.inputCardItemInputCont}>
            <TextInput
              editable={editable}
              underlineColorAndroid="transparent"
              onChangeText={onChangeText}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
              ref={inputRef}
              maxLength={maxLength}
              multiline={multiline}
              blurOnSubmit={blurOnSubmit}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKey}
              secureTextEntry={secureEntry}
              keyboardType={keyboardType}
              placeholder={placeholder}
              textAlignVertical={"top"}
              placeholderTextColor={colors.GREY_5}
              style={[inputCardStyle.inputCardInput, globleStyles.fontReg, multiline ? inputCardStyle.textArea : null, textInputStyle]} />
          </View>
        </View>
        <TouchableOpacity onPress={onPressRightIcon} style={{ marginRight: 10 }}>
          {rightIcon}
        </TouchableOpacity>
      </View>
    </>

    )
  }
}

const inputCardStyle = StyleSheet.create({
  inputCardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: radii.sm,
    paddingLeft: 12,
    backgroundColor: colors.WHITE,
    minHeight: 48,
  },
  inputCardItemLabel: {
    ...typography.label,
    paddingBottom: 6,
    color: colors.TEXT_SECONDARY,
    textTransform: 'none',
    fontSize: 13,
  },
  inputCardInput: {
    paddingBottom: 2,
    fontSize: 15,
    width: "100%",
    color: colors.TEXT_PRIMARY,
    height: Platform.OS == 'ios' ? 40 : 48,
    paddingLeft: 10,
    textAlignVertical: 'center',
    fontFamily: typography.body.fontFamily,
  },
  textArea: {
    height: 150,
    textAlign: 'auto',
    textAlignVertical: 'top',
    paddingVertical: 5
  }
})

export { InputCard };
