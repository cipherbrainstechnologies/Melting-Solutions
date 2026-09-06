
import React, { useState } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globleStyles, { width } from '../common/globleStyles';

const CustomSwitch = ({
    navigation,
    selectionMode,
    roundCorner,
    option1,
    option2,
    option3,
    option4,
    onSelectSwitch,
    selectionColor
}) => {
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);
    const [getRoundCorner, setRoundCorner] = useState(roundCorner);

    const updatedSwitchData = val => {
        setSelectionMode(val);
        onSelectSwitch(val);
    };

    return (
        <View>
            <View
                style={{
                    height: 44,
                    width: width * 0.95,
                    backgroundColor: 'white',
                    // borderRadius: getRoundCorner ? 25 : 0,
                    // borderWidth: 1,
                    // borderColor: selectionColor,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 2,
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updatedSwitchData(1)}
                    style={{
                        flex: 1,
                        backgroundColor: getSelectionMode == 1 ? selectionColor : 'white',
                        borderRadius: getRoundCorner ? 25 : 0,
                        borderWidth: 1,
                        borderColor: selectionColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 2,
                        marginLeft: 0
                    }}>
                    <Text
                        style={{
                            color: getSelectionMode == 1 ? 'white' : selectionColor,
                            ...globleStyles.fontSemiBold,
                            fontSize: 13
                        }}>
                        {option1}
                    </Text>
                </TouchableOpacity>
                {/* <View style={{ height: 38, width: 1, backgroundColor: selectionColor }} /> */}
                <TouchableOpacity
                    TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updatedSwitchData(2)}
                    style={{
                        flex: 1,
                        backgroundColor: getSelectionMode == 2 ? selectionColor : 'white',
                        borderRadius: getRoundCorner ? 25 : 0,
                        borderWidth: 1,
                        borderColor: selectionColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 2,
                        marginRight: option3 ? 2 : 0
                    }}>
                    <Text
                        style={{
                            color: getSelectionMode == 2 ? 'white' : selectionColor,
                            ...globleStyles.fontSemiBold,
                            fontSize: 13
                        }}>
                        {option2}
                    </Text>
                </TouchableOpacity>
                {option3 &&
                    <>
                        {/* <View style={{ height: 38, width: 1, backgroundColor: selectionColor }} /> */}
                        <TouchableOpacity
                            TouchableOpacity
                            activeOpacity={1}
                            onPress={() => updatedSwitchData(3)}
                            style={{
                                flex: 1,
                                backgroundColor: getSelectionMode == 3 ? selectionColor : 'white',
                                borderRadius: getRoundCorner ? 25 : 0,
                                borderWidth: 1,
                                borderColor: selectionColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 2,
                                marginRight: option4 ? 2 : 0
                            }}>
                            <Text
                                style={{
                                    color: getSelectionMode == 3 ? 'white' : selectionColor,
                                    ...globleStyles.fontSemiBold,
                                    fontSize: 13
                                }}>
                                {option3}
                            </Text>
                        </TouchableOpacity>
                    </>
                }
                {option4 &&
                    <>
                        {/* <View style={{ height: 38, width: 1, backgroundColor: selectionColor }} /> */}
                        <TouchableOpacity
                            TouchableOpacity
                            activeOpacity={1}
                            onPress={() => updatedSwitchData(4)}
                            style={{
                                flex: 1,
                                backgroundColor: getSelectionMode == 4 ? selectionColor : 'white',
                                borderRadius: getRoundCorner ? 25 : 0,
                                borderWidth: 1,
                                borderColor: selectionColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 2,
                                marginRight: 0
                            }}>
                            <Text
                                style={{
                                    color: getSelectionMode == 4 ? 'white' : selectionColor,
                                    ...globleStyles.fontSemiBold,
                                    fontSize: 13
                                }}>
                                {option4}
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        </View>
    );
};
export default CustomSwitch;