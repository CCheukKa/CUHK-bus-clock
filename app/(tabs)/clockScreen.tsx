import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ClockView } from '@/components/ClockView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { JourneyPlanner } from '@/components/JourneyPlanner';
import { FromTo } from '@/api/Bus';
import { Region } from '@/constants/BusData';
import { ThemeColours } from '@/constants/ThemeColours';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ClockScreen() {

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
    //
    const dateTimeTextStyle = useMemo(() => !useRealTime ? { color: 'lightpink' } : null, [useRealTime]);
    const clockView = useMemo(() =>
        <ClockView
            time={logicTime}
            fromTo={fromTo}
        />, [logicTime.add(0, 0, 0, -logicTime.getMilliseconds()).getTime()]
    );
    return (
        <SafeAreaView style={styles.safeAreaView}>
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
                                        // backgroundColor: pressed ? 'lightgreen' : 'lightseagreen',
                                        // backgroundColor: pressed ? 'deepskyblue' : 'dodgerblue',
                                        backgroundColor: pressed ? 'palevioletred' : 'lightpink',
                                    },
                                    styles.button,
                                ]}>
                                <FontAwesome6 name="clock-rotate-left" color={ThemeColours.black} size={20} />
                            </Pressable>
                        </View>
                        : null
                }
            </View>
            {clockView}
            <JourneyPlanner fromTo={fromTo} setFromTo={setFromTo} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ThemeColours.background,
    },
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
