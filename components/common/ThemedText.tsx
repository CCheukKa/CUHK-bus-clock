import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, StyleSheet, } from 'react-native';
import { FontSizes } from '@/utils/Typography';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'defaultPlus' | 'bold' | 'boldPlus' | 'faded' | 'title' | 'subtitle';
};

export function ThemedText({
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const { theme } = useTheme();

    const colour = theme.text;
    const strokeWidth = (() => {
        switch (type) {
            case 'bold':
            case 'boldPlus':
                return 0.1;
            case 'title':
                return 0.5;
            case 'subtitle':
                return 0.15;
            default:
                return 0;
        }
    })();

    return (
        <Text
            style={[
                styles.common,
                { color: colour },
                type === 'default' ? styles.default : undefined,
                type === 'defaultPlus' ? styles.plus : undefined,
                type === 'bold' ? styles.default : undefined,
                type === 'boldPlus' ? styles.plus : undefined,
                type === 'faded' ? [styles.faded, { color: theme.halfContrast },] : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    common: {
        fontFamily: 'KlintRoundedBold',
    },
    default: {
        fontSize: FontSizes.small,
    },
    plus: {
        fontSize: FontSizes.medium,
    },
    faded: {
        fontSize: FontSizes.small,
    },
    title: {
        fontSize: FontSizes.xxlarge,
    },
    subtitle: {
        fontSize: FontSizes.large,
    },
});
