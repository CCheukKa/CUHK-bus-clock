import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'faded';
};

export function ThemedText({
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const { theme } = useTheme();

    const colour = theme.text;
    return (
        <Text
            style={[
                { color: colour },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'faded' ? [styles.faded, { color: theme.halfContrast },] : undefined,
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
    faded: {
        fontSize: 16,
        lineHeight: 24,
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
});
