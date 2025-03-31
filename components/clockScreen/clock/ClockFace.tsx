import { StyleSheet, View } from 'react-native';
import { ClockThing, ClockThingType } from '@/components/clockScreen/clock/ClockThing';
import { ClockTicks } from '@/components/clockScreen/clock/ClockTicks';
import { RouteThings } from '@/components/clockScreen/clock/RouteThing';
import { EtaError, EtaInfo, isEtaError } from '@/utils/Bus';
import { useTheme } from '@/context/ThemeContext';
import { ClockNumbers } from '@/components/clockScreen/clock/ClockNumbers';
import { useSettings } from '@/context/SettingsContext';
import { ClockHands } from '@/components/clockScreen/clock/ClockHands';
import { ClockArcs } from '@/components/clockScreen/clock/ClockArcs';
import { useMemo } from 'react';

type ClockFaceProps = {
    time: Date;
    etaInfos: EtaInfo[] | EtaError;
};
export function ClockFace({ time, etaInfos }: ClockFaceProps) {
    const { theme } = useTheme();
    const { settings } = useSettings();

    return (
        settings.showClockFace
            ? <View style={styles.clockContainer}>
                <View style={styles.clockFaceContainer}>
                    <RouteThings currentTime={time} etaInfos={etaInfos} />

                    <View style={[
                        styles.clockFace,
                        {
                            backgroundColor: theme.background,
                            borderColor: settings.showPeekArcs ? theme.dimContrast : theme.highContrast,
                            shadowColor: theme.highContrast,
                            transform: [{ translateY: isEtaError(etaInfos) ? -80 : 0 }],
                        },
                    ]}>
                        {useMemo(() =>
                            settings.showPeekArcs
                                ? <ClockArcs time={time} />
                                : null
                            , [time.truncateTo('second').getTime(), settings.showPeekArcs]
                        )}
                        {useMemo(() => <ClockNumbers />, [])}
                        {useMemo(() => <ClockTicks />, [])}
                        {useMemo(() =>
                            <ClockHands time={time} />
                            , [time.truncateTo('second').getTime()]
                        )}
                        {useMemo(() => <ClockThing type={ClockThingType.CLOCK_CENTRE_DOT} degrees={0} distance={0} />, [])}
                    </View>
                </View>
            </View>
            : <View style={styles.clockFaceBuffer} />
    );
}

const styles = StyleSheet.create({
    clockContainer: {
        display: 'flex',
        width: '90%',
        aspectRatio: 1,
        transform: [{ scale: 0.9 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockFaceBuffer: {
        width: '100%',
        height: 10,
    },
    clockFaceContainer: {
        width: 180,
        aspectRatio: 1,
    },
    clockFace: {
        display: 'flex',
        width: '100%',
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