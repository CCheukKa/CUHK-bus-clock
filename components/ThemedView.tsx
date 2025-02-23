import { View, type ViewProps } from 'react-native';

import { useThemeColour } from '@/hooks/useThemeColour';

export type ThemedViewProps = ViewProps & {
    lightColour?: string;
    darkColour?: string;
};

export function ThemedView({ style, lightColour, darkColour, ...otherProps }: ThemedViewProps) {
    const backgroundColour = useThemeColour({ light: lightColour, dark: darkColour }, 'background');

    return <View style={[{ backgroundColor: backgroundColour }, style]} {...otherProps} />;
}
