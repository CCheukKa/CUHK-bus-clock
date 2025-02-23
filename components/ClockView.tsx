import { StyleSheet, View, type ViewProps } from 'react-native';
import { useMemo } from 'react';
import { ClockThing, ClockThingType } from '@/components/ClockThing';
import { ClockHand } from '@/components/ClockHand';
import { ClockTick, ClockTickType } from '@/components/ClockTick';
import { BusRoute } from '@/constants/Buses';
import { RouteThing } from './RouteThing';

export type ClockViewProps = {
    currentTime: Date;
} & ViewProps;

export function ClockView({ currentTime, ...otherProps }: ClockViewProps) {
    const clockNumbers = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
            return (
                <ClockThing type={ClockThingType.CLOCK_NUMBER} key={i} degrees={360 / 12 * i} length={0.8}>
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

    return (
        <View style={styles.clockContainer}>
            <View style={styles.clockFace}
                {...otherProps}
            >
                {clockNumbers}
                <ClockHand degrees={360 / 60 * currentTime.getMinutes() + 360 / 60 / 60 * currentTime.getSeconds()} />
                {clockTicks}
                <RouteThing route={BusRoute._5D} currentTime={currentTime} etaTime={new Date(1740329635521)} />
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