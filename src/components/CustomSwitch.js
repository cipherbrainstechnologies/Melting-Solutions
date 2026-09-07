
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import globleStyles, { width } from '../common/globleStyles';
import { colors, radii } from '../common/theme';

const CustomSwitch = ({
    selectionMode,
    roundCorner,
    option1,
    option2,
    option3,
    option4,
    onSelectSwitch,
    selectionColor = colors.PRIMARY_DARK,
}) => {
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);

    useEffect(() => {
        setSelectionMode(selectionMode);
    }, [selectionMode]);

    const updatedSwitchData = (val) => {
        setSelectionMode(val);
        onSelectSwitch(val);
    };

    const options = [option1, option2, option3, option4].filter(Boolean);
    const cornerRadius = roundCorner ? radii.pill : radii.sm;

    return (
        <View style={styles.wrap}>
            <View style={styles.track}>
                {options.map((label, index) => {
                    const value = index + 1;
                    const selected = getSelectionMode === value;
                    return (
                        <TouchableOpacity
                            key={label}
                            activeOpacity={0.85}
                            onPress={() => updatedSwitchData(value)}
                            style={[
                                styles.segment,
                                {
                                    borderRadius: cornerRadius,
                                    backgroundColor: selected ? selectionColor : colors.WHITE,
                                    borderColor: selectionColor,
                                },
                            ]}
                        >
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.segmentLabel,
                                    { color: selected ? colors.WHITE : selectionColor },
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        alignItems: 'center',
    },
    track: {
        minHeight: 44,
        width: width * 0.95,
        maxWidth: 480,
        flexDirection: 'row',
        backgroundColor: colors.SURFACE,
        borderRadius: radii.md,
        padding: 4,
    },
    segment: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 6,
        marginHorizontal: 2,
    },
    segmentLabel: {
        ...globleStyles.fontSemiBold,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
});

export default CustomSwitch;
