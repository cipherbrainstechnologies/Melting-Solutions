import { FontBold, FontLight, FontMedium, FontRegular, FontSemiBold } from './Constants';

export const colors = {
  PRIMARY_LIGHT: '#E8EDFF',
  PRIMARY_DARK: '#2A53D8',
  WHITE: '#fff',
  TRANSPARENT: 'transparent',
  BLACK: '#000',
  BLUE: 'blue',
  DARK_BLUE: '#2d3182',
  SKY: '#1E81D3',
  RED: 'red',
  LIGHT_RED: "#FF2121",
  DULL_RED: "#B41B00",
  LIGHT_YELLOW: "#dbd6a0",
  HEADER: '#2d3182',
  SIDEMENU: "#fff",
  SEARCH_TEXT: "#40c5e6",
  STAR: "#fda33b",
  GREEN: "#00cc66",
  GREY_1: '#f5f5f5',
  GREY_2: '#eeeeee',
  GREY_3: '#e0e0e0',
  GREY_4: '#bdbdbd',
  GREY_5: '#9e9e9e',
  GREY_6: '#757575',
  GREY_7: '#616161',
  GREY_8: '#424242',
  GREY_9: '#212121',
  TEXT_PRIMARY: '#1A1D26',
  TEXT_SECONDARY: '#5C6370',
  BORDER: '#E4E7EC',
  SURFACE: '#F8F9FC',
  fullTransparent: 'rgba(0,0,0,0)'
};

export const typography = {
  display: {
    fontFamily: FontBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: colors.TEXT_PRIMARY,
  },
  title: {
    fontFamily: FontBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.TEXT_PRIMARY,
  },
  heading: {
    fontFamily: FontSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.TEXT_PRIMARY,
  },
  body: {
    fontFamily: FontRegular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.TEXT_PRIMARY,
  },
  bodyMedium: {
    fontFamily: FontMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.TEXT_PRIMARY,
  },
  caption: {
    fontFamily: FontRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.TEXT_SECONDARY,
  },
  label: {
    fontFamily: FontMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: FontSemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.WHITE,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: '#1A1D26',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#1A1D26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  tabBar: {
    shadowColor: '#1A1D26',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
};