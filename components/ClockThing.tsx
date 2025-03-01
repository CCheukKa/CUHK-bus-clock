import { ThemeColours } from '@/constants/ThemeColours';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export enum ClockThingType {
    CLOCK_CENTRE_DOT = 'clockCentreDot',
    CLOCK_NUMBER = 'clockNumber',
    ROUTE_NUMBER_BUBBLE = 'routeNumber',
    ROUTE_ANNOTATION_LINE = 'routeAnnotationLine',
    ROUTE_ETA_COUNTDOWN = 'routeEtaCountdown',
};

/**
 * ClockThing component renders a circular clock element at a specified position.
 * 
 * @param {ClockThingType} [props.type] - The type of the clock thing.
 * @param {Object} [props.style] - The style of the clock thing.
 * @param {string} [props.style.backgroundColour] - The background colour of the clock thing.
 * @param {string} [props.style.textColour] - The text colour of the clock thing.
 * @param {number} [props.style.opacity] - The opacity of the clock thing.
 * @param {number} [props.x] - The [-1,1] x-coordinate of the clock thing.
 * @param {number} [props.y] - The [-1,1] y-coordinate of the clock thing.
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
    } & (
        { x: number; y: number; degrees?: never; distance?: never } |
        { degrees: number; distance: number; x?: never; y?: never }
    ) & {
        children?: ReactNode;
    };


export function ClockThing({ type, style, x, y, degrees, distance, children }: ClockThingProps) {
    let left: number, top: number;

    if (degrees !== undefined && distance !== undefined) {
        const radians = ((-degrees + 90) * Math.PI) / 180;
        left = 50 + distance * Math.cos(radians) * 50;
        top = 50 - distance * Math.sin(radians) * 50;
    } else if (x !== undefined && y !== undefined) {
        left = 50 + x * 50;
        top = 50 - y * 50;
    } else {
        left = 50;
        top = 50;
    }

    const contentWithin = (() => {
        switch (type) {
            case ClockThingType.CLOCK_CENTRE_DOT:
                return (<View style={styles.clockCentreDot} />);
            case ClockThingType.CLOCK_NUMBER:
                return (<Text style={styles.clockNumber}>{children}</Text>);
            case ClockThingType.ROUTE_NUMBER_BUBBLE:
                return (
                    <View style={[
                        styles.routeNumberContainer,
                        {
                            backgroundColor: style?.backgroundColour,
                            transform: [{ scale: style?.scale ?? 1 }],
                            shadowColor: ThemeColours.highContrast,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 10,
                            elevation: 1,
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
                        height: style?.height,
                        backgroundColor: style?.backgroundColour,
                        transform: [
                            { rotate: `${degrees}deg` },
                            { translateY: '50%' }
                        ]
                    }
                ]} />);
            case ClockThingType.ROUTE_ETA_COUNTDOWN:
                return (<Text style={[
                    styles.routeEtaCountdown,
                    {
                        color: style?.textColour,
                        textShadowColor: ThemeColours.dimContrast,
                        textShadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        textShadowRadius: 6,
                    }
                ]}>{children}</Text>);
            default:
                return children;
        }
    })();

    return (
        <View style={[
            styles.clockThing,
            { left: `${left}%`, top: `${top}%` }
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
        width: '10%',
        aspectRatio: 1,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
    },
    clockCentreDot: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: '50%',
        backgroundColor: ThemeColours.background,
        borderColor: ThemeColours.highContrast,
        borderWidth: 2.5,
    },
    clockNumber: {
        color: ThemeColours.halfContrast,
        fontSize: 20,
        fontWeight: 'bold',
    },
    routeAnnotationLine: {
        width: 5,
    },
    routeNumberContainer: {
        borderRadius: '50%',
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
    routeNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    routeEtaCountdown: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 80,
        textAlign: 'center',
    },
});