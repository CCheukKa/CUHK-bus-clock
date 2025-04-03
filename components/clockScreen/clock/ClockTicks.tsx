import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, View } from 'react-native';

export const enum ClockTickType {
    MAJOR = 'major',
    MINOR = 'minor',
}

type ClockTickProps = {
    type: ClockTickType;
    degrees: number;
};

function ClockTick({ type, degrees }: ClockTickProps) {
    const { theme } = useTheme();

    const radians = degrees * Math.PI / 180;
    return (
        <View style={[
            styles.clockTick,
            type === ClockTickType.MAJOR
                ? [styles.clockTickMajor, { backgroundColor: theme.halfContrast }]
                : [styles.clockTickMinor, { backgroundColor: theme.lowContrast }],
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

export function ClockTicks() {
    return Array.from({ length: 60 }, (_, i) => i + 1).map(i => {
        const degrees = 360 / 60 * i;
        return (
            <ClockTick type={i % 5 === 0 ? ClockTickType.MAJOR : ClockTickType.MINOR} degrees={degrees} key={i} />
        );
    });
}

const styles = StyleSheet.create({
    clockTick: {
        display: 'flex',
        position: 'absolute',
        transformOrigin: '0 0',
    },
    clockTickMajor: {
        width: 3,
        height: '5%',
    },
    clockTickMinor: {
        width: 2,
        height: '3%',
    },
});