import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base width used for design (you can adjust this to match your design)
const baseWidth = 360; // Common Android width
const baseHeight = 720; // Common Android height

// Scale based on screen width
export const wp = (widthPercent: number) => {
    const screenWidth = SCREEN_WIDTH;
    return PixelRatio.roundToNearestPixel(screenWidth * widthPercent / 100);
};

// Scale based on screen height
export const hp = (heightPercent: number) => {
    const screenHeight = SCREEN_HEIGHT;
    return PixelRatio.roundToNearestPixel(screenHeight * heightPercent / 100);
};

// Scale font size based on screen width
export const normalize = (size: number) => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Font sizes used throughout the app
export const FontSizes = {
    tiny: normalize(10),
    small: normalize(12),
    medium: normalize(14),
    large: normalize(16),
    xlarge: normalize(24),
    xxlarge: normalize(32),
};