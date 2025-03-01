import { StyleSheet, View, type ViewProps } from 'react-native';
import { useMemo } from 'react';
import { ClockThing, ClockThingType } from '@/components/ClockThing';
import { ClockHand } from '@/components/ClockHand';
import { ClockTick, ClockTickType } from '@/components/ClockTick';
import { getRouteThings } from '@/components/RouteThing';

export type ClockViewProps = {
    time: Date;
} & ViewProps;

export function ClockView({ time, ...otherProps }: ClockViewProps) {
    const clockNumbers = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
            return (
                <ClockThing type={ClockThingType.CLOCK_NUMBER} key={i} degrees={360 / 12 * i} distance={0.8}>
                    {i}
                </ClockThing>
            );
        });
    }, []);
    const clockTicks = useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => i + 1).map(i => {
            const degrees = 360 / 60 * i;
            return (
                <ClockTick type={i % 5 === 0 ? ClockTickType.MAJOR : ClockTickType.MINOR} degrees={degrees} key={i} />
            );
        });
    }, []);

    const routeThings = getRouteThings(time);

    return (
        <View style={styles.clockContainer}>
            <View style={styles.clockFace}
                {...otherProps}
            >
                {clockNumbers}
                {clockTicks}
                {routeThings}
                <ClockHand type='hour' degrees={360 / 12 * time.getHours() + 360 / 12 / 60 * time.getMinutes()} />
                <ClockHand type='minute' degrees={360 / 60 * time.getMinutes() + 360 / 60 / 60 * time.getSeconds()} />
                <ClockThing type={ClockThingType.CLOCK_CENTRE_DOT} x={0} y={0} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    clockContainer: {
        display: 'flex',
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockFace: {
        display: 'flex',
        width: '60%',
        aspectRatio: 1,
        backgroundColor: '#ffffff',
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