import { StyleSheet, View } from 'react-native';

export type ClockHandProps = {
    type: 'hour' | 'minute';
    degrees: number;
};

export function ClockHand({ type, degrees }: ClockHandProps) {
    const width = (() => {
        switch (type) {
            case 'hour': return 4;
            case 'minute': return 3;
            default: return '0%';
        }
    })();
    const height = (() => {
        switch (type) {
            case 'hour': return '28%';
            case 'minute': return '48%';
            default: return '0%';
        }
    })();
    const backgroundColor = (() => {
        switch (type) {
            case 'hour': return '#00000060';
            case 'minute': return '#000000';
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

const styles = StyleSheet.create({
    clockHand: {
        display: 'flex',
        position: 'absolute',
        transformOrigin: '0 0',
    }
});