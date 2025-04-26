import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/common/ThemedText';
import { ClockFace } from '@/components/clockScreen/clock/ClockFace';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { JourneyPlanner } from '@/components/clockScreen/JourneyPlanner';
import { FromTo, getEtaInfos, isEtaError } from '@/utils/Bus';
import { Region } from '@/constants/BusData';
import { EtaInfoPanel } from '@/components/clockScreen/EtaInfoPanel';
import { useSettings } from '@/context/SettingsContext';
import { FullscreenView } from '@/components/common/FullscreenView';
import { useTheme } from '@/context/ThemeContext';
import { isPublicHoliday } from '@/utils/PublicHolidayScraper';
import { WEEK_DAYS } from '@/constants/UI';
import { SuboptimalRouteStyle } from '@/utils/Settings';

export default function ClockScreen() {
    const { settings } = useSettings();
    const { theme } = useTheme();

    const [realTime, setRealTime] = useState(new Date());
    const [customTime, setCustomTime] = useState(new Date());
    const [useRealTime, setUseRealTime] = useState(true);
    const logicTime = useMemo(() => useRealTime ? realTime : customTime, [realTime, customTime, useRealTime]);
    // 
    const frameId = useRef<number | null>(null);
    const frameSecondTime = useRef<Date>(new Date());
    function updateRealTime() {
        if (new Date().getTime() - new Date(frameSecondTime.current).getTime() >= 1000) {
            frameSecondTime.current = new Date().truncateTo('second');
            setRealTime(new Date());
        }
        frameId.current = requestAnimationFrame(updateRealTime);
    };
    useEffect(() => { frameId.current = requestAnimationFrame(updateRealTime) }, []);
    // 
    const [dateTimePickerValue, setDateTimePickerValue] = useState(logicTime);
    type DateTimePickerMode = 'time' | 'date' | null;
    const [dateTimePickerMode, setDateTimePickerMode] = useState<DateTimePickerMode>(null);
    const showResetToCurrentTimeButton = useMemo(() => !useRealTime, [useRealTime]);
    // 
    const showDateTimePicker = useCallback((mode: DateTimePickerMode) => {
        setDateTimePickerValue(logicTime);
        setDateTimePickerMode(mode);
    }, [logicTime]);
    const handleDateTimePickerChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
        switch (event.type) {
            case 'dismissed':
                setDateTimePickerMode(null);
                break;
            case 'set':
                if (selectedDate) {
                    setUseRealTime(false);
                    setCustomTime(selectedDate);
                    setDateTimePickerValue(selectedDate);
                    setDateTimePickerMode(null);
                }
                break;
            case 'neutralButtonPressed':
            default:
                break;
        }
    }, []);
    const handleResetToCurrentTimeButtonPress = useCallback(() => {
        setUseRealTime(true);
        setDateTimePickerMode(null);
    }, []);
    //
    const [fromTo, setFromTo] = useState<FromTo>({ from: Region.MTR, to: Region.MAIN_CAMPUS });
    const { etaInfos, filteredCount } = useMemo(() => {
        const rawEtaInfos = getEtaInfos(fromTo, logicTime, settings.pastPeekMinutes, settings.futurePeekMinutes, settings.detectHolidays);
        if (isEtaError(rawEtaInfos)) { return { etaInfos: rawEtaInfos, filteredCount: NaN }; }
        if (settings.suboptimalRouteStyle === SuboptimalRouteStyle.HIDDEN) {
            const filteredEtaInfos = rawEtaInfos.filter(etaInfo => !etaInfo.journey.isSuboptimal);
            return filteredEtaInfos.length > 0
                ? { etaInfos: filteredEtaInfos, filteredCount: rawEtaInfos.length - filteredEtaInfos.length }
                : { etaInfos: rawEtaInfos, filteredCount: NaN };
        }
        return { etaInfos: rawEtaInfos, filteredCount: NaN };
    }, [
        fromTo,
        logicTime.truncateTo('second').getTime(),
        settings,
    ]
    );
    //
    const dateTimeTextStyle = useMemo(() => !useRealTime ? { color: theme.primary } : null, [useRealTime]);
    return (
        <FullscreenView>
            <View style={styles.headerContainer}>
                <View style={styles.dateTimeContainer}>
                    <TouchableOpacity onPress={() => { showDateTimePicker('date') }}>
                        {useMemo(() =>
                            <ThemedText type="subtitle" style={dateTimeTextStyle}>
                                {`${logicTime.toLocaleDateString('en-GB')} (${settings.detectHolidays && isPublicHoliday(logicTime) ? 'Holiday' : WEEK_DAYS[logicTime.getDay()].substring(0, 3)})`}
                            </ThemedText>
                            , [new Date(logicTime).truncateTo('day').getTime(), dateTimeTextStyle, settings]
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { showDateTimePicker('time') }}>
                        {useMemo(() =>
                            <ThemedText type="title" style={dateTimeTextStyle}>
                                {logicTime.toLocaleTimeString('en-GB')}
                            </ThemedText>
                            , [new Date(logicTime).truncateTo('second').getTime(), dateTimeTextStyle]
                        )}
                    </TouchableOpacity>
                </View>
                {filteredCount > 0
                    ? <View style={styles.filteredCountContainer}>
                        <MaterialCommunityIcons
                            name='bus'
                            size={18}
                            color={theme.lowContrast}
                        />
                        <MaterialCommunityIcons
                            name='filter-minus'
                            size={12}
                            color={theme.lowContrast}
                            style={{
                                position: 'relative',
                                left: -4,
                                margin: 0,
                                alignSelf: 'flex-start',
                            }}
                        />
                        <ThemedText style={{ color: theme.halfContrast }}>
                            {filteredCount}
                        </ThemedText>
                    </View>
                    : null
                }
                {dateTimePickerMode
                    ? (
                        <DateTimePicker
                            value={dateTimePickerValue}
                            mode={dateTimePickerMode}
                            is24Hour={true}
                            disabled={!dateTimePickerMode}
                            //! TODO: update @react-native-community/datetimepicker to ^8.3.0 after the issue is fixed
                            // design='material'
                            onChange={handleDateTimePickerChange}
                        />
                    )
                    : null
                }
                {showResetToCurrentTimeButton
                    ? <View style={[
                        styles.resetToCurrentTimeButtonContainer,
                        { right: settings.showClockFace ? 0 : 30 },
                    ]}>
                        <TouchableOpacity
                            onPress={handleResetToCurrentTimeButtonPress}
                            activeOpacity={0.4}
                            style={[
                                styles.resetToCurrentTimeButton,
                                { backgroundColor: theme.primary },
                            ]}
                        >
                            <FontAwesome6 name="clock-rotate-left" color={theme.background} size={20} />
                        </TouchableOpacity>
                    </View>
                    : null
                }
            </View>
            {useMemo(() =>
                <ClockFace
                    time={logicTime}
                    etaInfos={etaInfos}
                />, [logicTime, etaInfos, settings]
            )}
            {useMemo(() =>
                <JourneyPlanner
                    fromTo={fromTo}
                    setFromTo={setFromTo}
                />, [fromTo]
            )}
            {useMemo(() =>
                <EtaInfoPanel
                    time={logicTime}
                    etaInfos={etaInfos}
                />, [logicTime, etaInfos, settings]
            )}
        </FullscreenView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '90%',
        marginTop: 24,
    },
    filteredCountContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetToCurrentTimeButtonContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        aspectRatio: 1,
    },
    resetToCurrentTimeButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: '60%',
        aspectRatio: 1,
    },
});
