import { StyleSheet, View } from 'react-native';

export enum ClockTickType {
    MAJOR = 'major',
    MINOR = 'minor',
};

type ClockTickProps = {
    type: ClockTickType;
    degrees: number;
};

export function ClockTick({ type, degrees }: ClockTickProps) {
    const radians = degrees * Math.PI / 180;
    return (
        <View style={[
            styles.clockTick,
            type === ClockTickType.MAJOR ? styles.clockTickMajor : styles.clockTickMinor,
            [{
                top: `${-Math.cos(radians) * 50 + 50}%`, left: `${Math.sin(radians) * 50 + 50}%`,
                transform: [
                    { rotate: `${degrees + 180}deg` },
                    { translateX: '-50%' },
                    { translateY: '-100%' },
                ],
            }],
        ]} />
    );
}

const styles = StyleSheet.create({
    clockTick: {
        display: 'flex',
        position: 'absolute',
        backgroundColor: '#000000',
        transformOrigin: '0 0',
    },
    clockTickMajor: {
        width: 3,
        height: '5%',
        opacity: 0.6,
    },
    clockTickMinor: {
        width: 2,
        height: '3%',
        opacity: 0.4,
    },
});