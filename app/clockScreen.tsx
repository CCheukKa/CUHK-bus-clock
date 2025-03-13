import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ClockFace } from '@/components/ClockFace';
import { FontAwesome6 } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { JourneyPlanner } from '@/components/JourneyPlanner';
import { FromTo, getEtaInfos } from '@/backend/Bus';
import { Region } from '@/constants/BusData';
import { DetailedEtaInfo } from '@/components/DetailedEtaInfo';
import { useSettings } from '@/context/SettingsContext';
import { FullscreenView } from '@/components/FullscreenView';
import { useTheme } from '@/context/ThemeContext';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ClockScreen() {
    const { settings } = useSettings();
    const { theme } = useTheme();

    const [realTime, setRealTime] = useState(new Date());
    const [customTime, setCustomTime] = useState(new Date());
    const [useRealTime, setUseRealTime] = useState(true);
    const logicTime = useMemo(() => useRealTime ? realTime : customTime, [realTime, customTime, useRealTime]);
    // 
    const frameId = useRef<number | null>(null);
    const updateRealTime = () => {
        setRealTime(new Date());
        frameId.current = requestAnimationFrame(updateRealTime);
    };
    useEffect(() => {
        frameId.current = requestAnimationFrame(updateRealTime);
        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, []);
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
    const etaInfos = useMemo(() =>
        getEtaInfos(fromTo, logicTime, settings.pastPeekMinutes, settings.futurePeekMinutes),
        [
            fromTo,
            logicTime.truncateTo('second').getTime(),
        ]
    );
    //
    const dateTimeTextStyle = useMemo(() => !useRealTime ? { color: theme.primary } : null, [useRealTime]);
    return (
        <FullscreenView>
            <View style={styles.headerContainer}>
                <View style={styles.dateTimeContainer}>
                    <TouchableOpacity onPress={() => { showDateTimePicker('date') }}>
                        <ThemedText type="subtitle" style={dateTimeTextStyle}>
                            {`${logicTime.toLocaleDateString('en-GB')} (${weekDays[logicTime.getDay()]})`}
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { showDateTimePicker('time') }}>
                        <ThemedText type="title" style={dateTimeTextStyle}>
                            {logicTime.toLocaleTimeString('en-GB')}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
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
                {
                    showResetToCurrentTimeButton
                        ? <View style={styles.buttonContainer}>
                            <Pressable
                                onPress={handleResetToCurrentTimeButtonPress}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: !pressed
                                            ? theme.primary
                                            : theme.primaryHeavy,
                                    },
                                    styles.button,
                                ]}>
                                <FontAwesome6 name="clock-rotate-left" color={theme.background} size={20} />
                            </Pressable>
                        </View>
                        : null
                }
            </View>
            {useMemo(() =>
                <ClockFace
                    time={logicTime}
                    etaInfos={etaInfos}
                />, [etaInfos, settings]
            )}
            {useMemo(() =>
                <JourneyPlanner
                    fromTo={fromTo}
                    setFromTo={setFromTo}
                />, [fromTo]
            )}
            {useMemo(() =>
                <DetailedEtaInfo
                    time={logicTime}
                    etaInfos={etaInfos}
                />, [etaInfos, settings]
            )}
        </FullscreenView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '90%',
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonContainer: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        aspectRatio: 1,
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: '60%',
        aspectRatio: 1,
    },
});
