import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MathExtra } from '@/utils/Helper';
import { ThemedText } from '@/components/common/ThemedText';

export const enum ClockThingType {
    CLOCK_CENTRE_DOT = 'clockCentreDot',
    CLOCK_NUMBER = 'clockNumber',
    ROUTE_BUBBLE = 'routeBubble',
    ROUTE_ANNOTATION_LINE = 'routeAnnotationLine',
    ROUTE_TIMING = 'routeTiming',
    ERROR_TEXT = 'errorText',
};

/**
 * ClockThing component renders a circular clock element at a specified position.
 * 
 * @param {ClockThingType} [props.type] - The type of the clock thing.
 * @param {Object} [props.style] - The style of the clock thing.
 * @param {string} [props.style.backgroundColour] - The background colour of the clock thing.
 * @param {string} [props.style.textColour] - The text colour of the clock thing.
 * @param {number} [props.style.opacity] - The opacity of the clock thing.
 * @param {number} [props.degrees] - The angle in degrees of the clock thing. (0 is 12 o'clock; clockwise)
 * @param {number} [props.distance] - The distance from the center of the clock thing.
 */
type ClockThingProps =
    {
        type?: ClockThingType;
        style?: {
            height?: number;
            backgroundColour?: string;
            textColour?: string;
            scale?: number;
            borderColour?: string;
        };
        degrees: number;
        distance: number;
        onPress?: () => void;
        children?: ReactNode;
    };


export function ClockThing({ type, style, degrees, distance, onPress, children }: ClockThingProps) {
    const { theme } = useTheme();

    const { x, y } = MathExtra.clockPolarToXY(degrees, distance);
    const left = x * 50 + 50;
    const top = -y * 50 + 50;

    const contentWithin = (() => {
        switch (type) {
            case ClockThingType.CLOCK_CENTRE_DOT:
                return (<View style={[
                    mainStyles.clockCentreDot,
                    {
                        backgroundColor: theme.background,
                        borderColor: theme.highContrast,
                    },
                ]} />);
            case ClockThingType.CLOCK_NUMBER:
                return (<View style={mainStyles.clockNumberContainer}>
                    <ThemedText type='subtitle' style={[
                        mainStyles.clockNumber,
                        { color: theme.halfContrast },
                    ]}>{children}</ThemedText>
                </View>);
            case ClockThingType.ROUTE_BUBBLE:
                return (
                    <TouchableOpacity
                        style={[
                            auxiliaryStyles.routeBubble,
                            {
                                backgroundColor: style?.backgroundColour,
                                transform: [{ scale: style?.scale ?? 1 }],
                                shadowColor: theme.highContrast,
                            },
                            style?.borderColour
                                ? {
                                    borderColor: style.borderColour,
                                    borderWidth: 2,
                                } : null,
                        ]}
                        onPress={onPress}
                    >
                        <ThemedText
                            type='boldPlus'
                            style={[
                                auxiliaryStyles.routeNumber,
                                { color: style?.textColour }
                            ]}
                        >
                            {children}
                        </ThemedText>
                    </TouchableOpacity>
                );
            case ClockThingType.ROUTE_ANNOTATION_LINE:
                return (<View style={[
                    auxiliaryStyles.routeAnnotationLine,
                    {
                        height: style?.height ? `${style.height}%` : undefined,
                        backgroundColor: style?.backgroundColour,
                        transform: [
                            { rotate: `${degrees}deg` },
                            { translateY: '50%' }
                        ],
                    }
                ]} />);
            case ClockThingType.ROUTE_TIMING:
                return (<ThemedText style={[
                    auxiliaryStyles.routeTiming,
                    {
                        color: style?.textColour,
                        textShadowColor: theme.dimContrast,
                    }
                ]}>{children}</ThemedText>);
            case ClockThingType.ERROR_TEXT:
                return (<View style={auxiliaryStyles.errorTextContainer}>
                    <ThemedText style={[
                        auxiliaryStyles.errorText,
                        {
                            color: theme.primaryHeavy,
                            textShadowColor: theme.primarySharp,
                        },
                    ]}>
                        {children}
                    </ThemedText>
                </View>);
            default:
                return children;
        }
    })();

    return (
        <View style={[
            mainStyles.clockThing,
            { left: `${left}%`, top: `${top}%` },
            type === ClockThingType.ROUTE_ANNOTATION_LINE ? { width: '10%' } : null, //TODO: find an actual solution
        ]}>
            {contentWithin}
        </View>
    );
}

const mainStyles = StyleSheet.create({
    clockThing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
    },
    clockCentreDot: {
        width: '3%',
        aspectRatio: 1,
        borderRadius: '50%',
        borderWidth: 2.5,
    },
    clockNumberContainer: {
        width: 30,
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockNumber: {
        width: '100%',
        aspectRatio: 1,
        textAlign: 'center',
        transform: [{ translateY: 4 }],
    },
});

const auxiliaryStyles = StyleSheet.create({
    routeAnnotationLine: {
        width: 5,
    },
    routeBubble: {
        borderRadius: '50%',
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 1,
    },
    routeNumber: {
        textAlign: 'center',
    },
    routeTiming: {
        textAlign: 'center',
        textShadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        textShadowRadius: 6,
    },
    errorTextContainer: {
        height: 170,
        width: 400,
        position: 'absolute',
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        paddingVertical: 8,
        textAlign: 'center',
        textShadowRadius: 40,
    },
});