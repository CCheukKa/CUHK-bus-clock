
import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, View } from 'react-native';

enum ClockHandType {
    HOUR,
    MINUTE,
}
type ClockHandProps = {
    type: ClockHandType;
    degrees: number;
};
function ClockHand({ type, degrees }: ClockHandProps) {
    const { theme } = useTheme();

    const width = (() => {
        switch (type) {
            case ClockHandType.HOUR: return 4;
            case ClockHandType.MINUTE: return 3;
            default: return '0%';
        }
    })();
    const height = (() => {
        switch (type) {
            case ClockHandType.HOUR: return '28%';
            case ClockHandType.MINUTE: return '46%';
            default: return '0%';
        }
    })();
    const backgroundColor = (() => {
        switch (type) {
            case ClockHandType.HOUR: return theme.lowContrast;
            case ClockHandType.MINUTE: return theme.highContrast;
            default: return '0%';
        }
    })();
    return (
        <View style={[
            styles.clockHand,
            [{
                width,
                height,
                backgroundColor,
                top: '50%', left: '50%',
                transform: [
                    { rotate: `${degrees + 180}deg` },
                    { translateX: '-50%' },
                ],
            }],
        ]} />
    );
}

type ClockHandsProps = {
    time: Date;
};
export function ClockHands({ time }: ClockHandsProps) {
    return (
        <>
            <ClockHand type={ClockHandType.HOUR} degrees={360 / 12 * time.getHours() + 360 / 12 / 60 * time.getMinutes()} />
            <ClockHand type={ClockHandType.MINUTE} degrees={360 / 60 * time.getMinutes() + 360 / 60 / 60 * time.getSeconds()} />
        </>
    );
}

const styles = StyleSheet.create({
    clockHand: {
        display: 'flex',
        position: 'absolute',
        transformOrigin: '0 0',
    }
});