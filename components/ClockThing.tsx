import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MathExtra } from '@/backend/Helper';

export enum ClockThingType {
    CLOCK_CENTRE_DOT = 'clockCentreDot',
    CLOCK_NUMBER = 'clockNumber',
    ROUTE_BUBBLE = 'routeNumber',
    ROUTE_ANNOTATION_LINE = 'routeAnnotationLine',
    ROUTE_ETA_COUNTDOWN = 'routeEtaCountdown',
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
        };
        degrees: number;
        distance: number;
        children?: ReactNode;
    };


export function ClockThing({ type, style, degrees, distance, children }: ClockThingProps) {
    const { theme } = useTheme();

    const { x, y } = MathExtra.clockPolarToXY(degrees, distance);
    const left = x * 50 + 50;
    const top = -y * 50 + 50;

    const contentWithin = (() => {
        switch (type) {
            case ClockThingType.CLOCK_CENTRE_DOT:
                return (<View style={[
                    styles.clockCentreDot,
                    {
                        backgroundColor: theme.background,
                        borderColor: theme.highContrast,
                    },
                ]} />);
            case ClockThingType.CLOCK_NUMBER:
                return (<View style={styles.clockNumberContainer}>
                    <Text style={[
                        styles.clockNumber,
                        { color: theme.halfContrast },
                    ]}>{children}</Text>
                </View>);
            case ClockThingType.ROUTE_BUBBLE:
                return (
                    <View style={[
                        styles.routeBubble,
                        {
                            backgroundColor: style?.backgroundColour,
                            transform: [{ scale: style?.scale ?? 1 }],
                            shadowColor: theme.highContrast,
                        }
                    ]}>
                        <Text style={[
                            styles.routeNumber,
                            { color: style?.textColour }
                        ]}>
                            {children}
                        </Text>
                    </View>
                );
            case ClockThingType.ROUTE_ANNOTATION_LINE:
                return (<View style={[
                    styles.routeAnnotationLine,
                    {
                        height: style?.height ? `${style.height}%` : undefined,
                        backgroundColor: style?.backgroundColour,
                        transform: [
                            { rotate: `${degrees}deg` },
                            { translateY: '50%' }
                        ],
                    }
                ]} />);
            case ClockThingType.ROUTE_ETA_COUNTDOWN:
                return (<Text style={[
                    styles.routeEtaCountdown,
                    {
                        color: style?.textColour,
                        textShadowColor: theme.dimContrast,
                    }
                ]}>{children}</Text>);
            case ClockThingType.ERROR_TEXT:
                return (<View style={styles.errorTextContainer}>
                    <Text
                        style={[
                            styles.errorText,
                            {
                                color: theme.primaryHeavy,
                                textShadowColor: theme.primarySharp,
                            },
                        ]}
                    >{children}</Text>
                </View>);
            default:
                return children;
        }
    })();

    return (
        <View style={[
            styles.clockThing,
            { left: `${left}%`, top: `${top}%` },
            type === ClockThingType.ROUTE_ANNOTATION_LINE ? { width: '10%' } : null, //TODO: find an actual solution
        ]}>
            {contentWithin}
        </View>
    );
}

const styles = StyleSheet.create({
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
        fontSize: 20,
        fontWeight: 'bold',
        transform: [{ translateY: 1 }],
    },
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    routeEtaCountdown: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        textShadowRadius: 6,
        // backgroundColor: 'red',
    },
    errorTextContainer: {
        height: 90,
        width: 400,
        position: 'absolute',
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        paddingVertical: 6,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowRadius: 40,
    },
});