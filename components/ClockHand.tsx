import { StyleSheet, View, ViewProps } from 'react-native';

export type ClockHandProps = {
    type: 'hour' | 'minute';
    degrees: number;
} & ViewProps;

export function ClockHand({ type, degrees, ...otherProps }: ClockHandProps) {
    const height = (() => {
        switch (type) {
            case 'hour': return '30%';
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
                height,
                backgroundColor,
                top: '50%', left: '50%',
                transform: [
                    { rotate: `${degrees + 180}deg` },
                    { translateX: '-50%' },
                ],
            }],
        ]} {...otherProps} />
    );
}

const styles = StyleSheet.create({
    clockHand: {
        display: 'flex',
        position: 'absolute',
        width: 3,
        transformOrigin: '0 0',
    }
});