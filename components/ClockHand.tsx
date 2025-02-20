import { StyleSheet, View, ViewProps } from 'react-native';

export type ClockHandProps = {
    degrees: number;
} & ViewProps;

export function ClockHand({ degrees, ...otherProps }: ClockHandProps) {
    return (
        <View style={[
            styles.clockHand,
            [{
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
        height: '48%',
        backgroundColor: '#000000',
        transformOrigin: '0 0',
    }
});