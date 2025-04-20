import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { FontSizes, normalize } from '@/utils/Typography';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'faded' | 'defaultPlus';
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
                type === 'defaultPlus' ? [styles.defaultPlus] : undefined,
                type === 'faded' ? [styles.faded, { color: theme.halfContrast },] : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: FontSizes.small,
        lineHeight: normalize(24),
    },
    defaultSemiBold: {
        fontSize: FontSizes.small,
        lineHeight: normalize(24),
        fontWeight: '600',
    },
    faded: {
        fontSize: FontSizes.small,
        lineHeight: normalize(12),
    },
    title: {
        fontSize: FontSizes.xxlarge,
        fontWeight: 'bold',
        lineHeight: normalize(32),
    },
    subtitle: {
        fontSize: FontSizes.large,
        fontWeight: 'bold',
    },
    defaultPlus: {
        fontSize: FontSizes.medium,
        fontWeight: 'bold',
    },
});
