import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColour } from '@/hooks/useThemeColour';

export type ThemedTextProps = TextProps & {
    lightColour?: string;
    darkColour?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
    style,
    lightColour,
    darkColour,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const colour = useThemeColour({ light: lightColour, dark: darkColour }, 'text');

    return (
        <Text
            style={[
                { color: colour },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
});
