import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, StyleSheet, } from 'react-native';
import { FontSizes } from '@/utils/Typography';
import { Font } from '@/app/_layout';

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
        fontFamily: Font.KlintRounded700,
    },
    default: {
        fontSize: FontSizes.small,
        fontFamily: Font.KlintRounded600,
    },
    plus: {
        fontSize: FontSizes.medium,
    },
    faded: {
        fontSize: FontSizes.small,
    },
    title: {
        fontSize: FontSizes.xxlarge,
        fontFamily: Font.KlintRounded800,
    },
    subtitle: {
        fontSize: FontSizes.large,
        fontFamily: Font.KlintRounded700,
    },
});
