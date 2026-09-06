import {
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native';
import { FontBold, FontLight, FontMedium, FontRegular, FontSemiBold } from './Constants';
import { colors, typography, spacing, radii } from './theme';

export const { width, height } = Dimensions.get("window");
export const { colorApp } = colors;
const productsItemWidth = (width / 2) - 7;
const IS_IPHONE_X = height === 812 || height === 896;
const globleStyles = StyleSheet.create({
  
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    marginHorizontal: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  headerView1: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER
  },
  headerText: {
    ...typography.title,
    fontSize: width >= 900 ? 22 : 20,
  },
  centerTitleView: { alignSelf: 'center', flex: 1, alignItems: 'center', position: 'absolute', left: 1, right: 1 },
  LeftTitleView: { alignSelf: 'center', flex: 1, alignItems: 'flex-start', marginLeft: spacing.sm },


  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  mainViewWithColor: {
    flex: 1,
    backgroundColor: colors.SURFACE,
  },
  subMainView: {
    marginHorizontal: spacing.md,
    paddingBottom: 120,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  subHeader: {
    ...typography.display,
    fontSize: width >= 900 ? 28 : 24,
    marginBottom: spacing.xs,
  },
  subHeaderCenter: {
    ...typography.display,
    alignSelf: 'center'
  },
  normalText: {
    ...typography.body,
    color: colors.TEXT_SECONDARY,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  screenDescription: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  normalTextWhite: {
    fontSize: 12,
    fontFamily: FontRegular,
    color: colors.WHITE
  },
  fontBold: {
    fontFamily: FontBold
  },
  fontSemiBold: {
    fontFamily: FontSemiBold
  },
  fontReg: {
    fontFamily: FontRegular
  },
  fontMedium: {
    fontFamily: FontMedium
  },
  fontLight: {
    fontFamily: FontLight
  },
  actionLine: {
    height: 20,
    flexDirection: "row",
    marginTop: 0,
    alignSelf: 'center'
  },
  actionItem: {
    height: 20,
    marginLeft: 5,
    marginRight: 15,
    alignSelf: "center"
  },
  actionText: {
    fontFamily: FontRegular,
    fontSize: 15,
  },
  profileIcon: {
    // backgroundColor: 'blue',
    resizeMode: 'cover',
    width: 100,
    height: 100,
    marginTop: 0,
    // marginLeft: 10,
    borderRadius: 10,
  },
  profileEditIcon: {
    width: 30,
    height: 30,
    right: width * 0.38,
    bottom: -5,
    // alignSelf: 'flex-end',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.PRIMARY_DARK,
    // textAlign: 'center',
    // textAlignVertical: 'center',
    borderRadius: 5,
    position: 'absolute',
  },
  profileEditView: {
    // width: 30,
    // height: 30,
    // right: width * 0.38,
    bottom: -5,
    // alignSelf: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.PRIMARY_DARK,
    // textAlign: 'center',
    // textAlignVertical: 'center',
    borderRadius: 5,
    position: 'absolute',
  },
  toggleIconView: { width: 45, height: 45, backgroundColor: colors.WHITE, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  drawerContainer: {
    backgroundColor: colors.WHITE,
    flex: 1,
    //paddingVertical:30,
    paddingHorizontal: 10,
  },
  drawerItemCont: {
    // flex: 3,
    //justifyContent:"center",
    paddingVertical: 20
  },
  drawerUsername: {
    fontSize: 16,
    fontFamily: FontBold,
    color: colors.BLACK,
  },
  drawerUserEmail: {
    fontSize: 16,
    fontFamily: FontRegular,
    color: colors.GREY_6,
  },
  drawerChangeLink: {
    fontSize: 16,
    fontFamily: FontMedium,
    color: colors.PRIMARY_DARK,
    textDecorationLine: 'underline'
  },
  drawerItemContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginBottom: 9,
    alignItems: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    color: colors.BLACK,
    fontFamily: FontRegular,
    marginLeft: 10
    // textAlign: "right",
  },
  addIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
    backgroundColor: colors.PRIMARY_DARK,
    height: Platform.OS == 'ios' ? 35 : 45,
    width: Platform.OS == 'ios' ? 35 : 45,
    borderRadius: 5
  },
  cardIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
    backgroundColor: colors.PRIMARY_LIGHT,
    height: 30,
    width: 30,
    borderRadius: 5
  },
  cardTextLabel: {
    ...typography.label,
    fontSize: 11,
  },
  cardTextValue: {
    ...typography.bodyMedium,
    fontSize: 14,
  },
  userCard: {
    borderColor: colors.BORDER,
    borderWidth: 1,
    borderRadius: radii.md,
    backgroundColor: colors.WHITE,
    padding: spacing.sm,
    marginVertical: spacing.xs,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.LIGHT_RED,
    backgroundColor: colors.WHITE,
    borderRadius: radii.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    ...typography.bodyMedium,
    color: colors.LIGHT_RED,
  },
  errorText: {
    color: colors.RED,
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 12
  },
});
export default globleStyles;
