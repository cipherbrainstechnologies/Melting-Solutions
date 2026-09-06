import { Box, HStack, Text } from "native-base"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../common/theme"
import { Entypo } from 'react-native-vector-icons';
import globleStyles from "../common/globleStyles";

export default function Header(props) {
    const showRightIcon = !props.isRightIconHide;
    const showLeftIcon = !props.isLeftIconHide;

    return (
        <>
            <Box safeAreaTop bg={colors.WHITE} />
            <HStack style={[globleStyles.headerView, props.style, props.isBorder && globleStyles.headerView1]}>
                {showLeftIcon ? (
                    <TouchableOpacity
                        onPress={props.onPress}
                        style={styles.iconButton}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Entypo name="chevron-left" color={colors.TEXT_PRIMARY} size={26} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

                <View style={[
                    props.isTitleCenter || props.isTitleCenter == null
                        ? globleStyles.centerTitleView
                        : globleStyles.LeftTitleView
                ]}>
                    <Text style={[globleStyles.headerText, props.styleTitle]} numberOfLines={1}>
                        {props.title}
                    </Text>
                </View>

                {showRightIcon ? (
                    <TouchableOpacity
                        onPress={props.onPressRightIcon}
                        style={styles.iconButton}
                        accessibilityRole="button"
                        accessibilityLabel={props.rightIconName === 'log-out' ? 'Sign out' : 'Action'}
                    >
                        <Entypo
                            name={props.rightIconName || 'dots-three-horizontal'}
                            color={props.rightIconName === 'log-out' ? colors.LIGHT_RED : colors.TEXT_PRIMARY}
                            size={24}
                        />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}
            </HStack>
        </>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
    },
});
