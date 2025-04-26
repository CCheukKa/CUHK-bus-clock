import { useTheme } from '@/context/ThemeContext';
import { Text, type TextProps, StyleSheet, } from 'react-native';
import { FontSizes } from '@/utils/Typography';
import { StrokeWrapper, StrokeWrapperProps } from '@/components/common/StrokeWrapper';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'defaultPlus' | 'bold' | 'boldPlus' | 'faded' | 'title' | 'subtitle';
    strokeWrapperStyle?: StrokeWrapperProps;
};

export function ThemedText({
    style,
    type = 'default',
    strokeWrapperStyle,
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

    const textElement = (
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
    if (strokeWidth <= 0) { return textElement; }

    return (
        <StrokeWrapper strokeWidth={strokeWidth} cloneCount={8} {...strokeWrapperStyle}>
            {textElement}
        </StrokeWrapper>
    );
}

const styles = StyleSheet.create({
    common: {
        fontFamily: 'KlintRounded',
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
