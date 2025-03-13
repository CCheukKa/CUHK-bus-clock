import { StyleSheet, View } from 'react-native';
import { ClockThing, ClockThingType } from '@/components/ClockThing';
import { ClockHand, ClockHandType } from '@/components/ClockHand';
import ClockTicks from '@/components/ClockTicks';
import { RouteThings } from '@/components/RouteThing';
import { EtaError, EtaInfo } from '@/backend/Bus';
import { useTheme } from '@/context/ThemeContext';
import ClockNumbers from '@/components/ClockNumbers';
import { useSettings } from '@/context/SettingsContext';

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
                            borderColor: theme.highContrast,
                            shadowColor: theme.highContrast,
                        },
                    ]}>
                        <ClockNumbers />
                        <ClockTicks />
                        <ClockHands time={time} />
                        <ClockThing type={ClockThingType.CLOCK_CENTRE_DOT} degrees={0} distance={0} />
                    </View>
                </View>
            </View>
            : <View style={styles.clockFaceBuffer} />
    );
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
    clockFaceBuffer: {
        width: '100%',
        height: 10,
    },
    clockFaceContainer: {
        width: 200,
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