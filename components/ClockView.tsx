import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { ClockThing, ClockThingType } from '@/components/ClockThing';

export function ClockView({ ...otherProps }: ViewProps) {
    return (
        <View style={styles.clockContainer}>
            <View style={styles.clockFace}
                {...otherProps}
            >
                {
                    Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
                        return (
                            <ClockThing type={ClockThingType.ClockNumber} key={i} degrees={360 / 12 * i} length={0.9}>
                                {i}
                            </ClockThing>
                        );
                    })
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    clockContainer: {
        display: 'flex',
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockFace: {
        display: 'flex',
        width: '90%',
        aspectRatio: 1,
        backgroundColor: '#00ff00',
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});