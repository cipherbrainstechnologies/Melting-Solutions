import { Box, HStack, Stack, StatusBar, Text } from "native-base"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../common/theme"
import { Entypo } from 'react-native-vector-icons';
import globleStyles from "../common/globleStyles";

export default function Header(props) {

    return <>
        {/* <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} /> */}
        <Box safeAreaTop bg="#ffffff" />
        <HStack style={[globleStyles.headerView, props.style, props.isBorder && globleStyles.headerView1]}>
            {props.isLeftIconHide ? null : <TouchableOpacity onPress={props.onPress}>
                <Entypo name="chevron-left" color="black" size={25} />
            </TouchableOpacity>
            }
            <View style={[props.isTitleCenter || props.isTitleCenter == null ? globleStyles.centerTitleView : globleStyles.LeftTitleView]}>
                <Text style={[globleStyles.headerText, props.styleTitle]}>{props.title}</Text>
            </View >
            {props.isRightIconHide ? null : <TouchableOpacity onPress={props.onPressRightIcon}>
                <Entypo name={props.rightIconName} color="black" size={25} />
            </TouchableOpacity>
            }
        </HStack>
    </>
}