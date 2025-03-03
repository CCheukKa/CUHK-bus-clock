import { StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { ClockThing, ClockThingType } from '@/components/ClockThing';
import { ClockHand, ClockHandType } from '@/components/ClockHand';
import { ClockTick, ClockTickType } from '@/components/ClockTick';
import { RouteThings } from '@/components/RouteThing';
import { EtaInfo } from '@/backend/Bus';
import { useTheme } from '@/context/ThemeContext';

type ClockFaceProps = {
    time: Date;
    etaInfos: EtaInfo[];
};
export function ClockFace({ time, etaInfos }: ClockFaceProps) {
    const { theme } = useTheme();

    return (
        <View style={styles.clockContainer}>
            <View style={[
                styles.clockFace,
                {
                    backgroundColor: theme.background,
                    borderColor: theme.highContrast,
                    shadowColor: theme.highContrast,
                },
            ]}>
                <ClockNumbers />
                <ClockTicks />
                <ClockHands time={time} />
                <ClockThing type={ClockThingType.CLOCK_CENTRE_DOT} x={0} y={0} />

                <RouteThings currentTime={time} etaInfos={etaInfos} />
            </View>
        </View>
    );
}

function ClockNumbers() {
    return useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
            return (
                <ClockThing type={ClockThingType.CLOCK_NUMBER} key={i} degrees={360 / 12 * i} distance={0.76}>
                    {i}
                </ClockThing>
            );
        });
    }, []);
}

function ClockTicks() {
    return useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => i + 1).map(i => {
            const degrees = 360 / 60 * i;
            return (
                <ClockTick type={i % 5 === 0 ? ClockTickType.MAJOR : ClockTickType.MINOR} degrees={degrees} key={i} />
            );
        });
    }, []);
}

type ClockHandsProps = {
    time: Date;
};
function ClockHands({ time }: ClockHandsProps) {
    return (
        <>
            <ClockHand type={ClockHandType.HOUR} degrees={360 / 12 * time.getHours() + 360 / 12 / 60 * time.getMinutes()} />
            <ClockHand type={ClockHandType.MINUTE} degrees={360 / 60 * time.getMinutes() + 360 / 60 / 60 * time.getSeconds()} />
        </>
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
        width: '50%',
        aspectRatio: 1,
        borderRadius: '50%',
        borderWidth: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});