import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ClockView } from '@/components/ClockView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClockScreen() {

    const [currentTime, setCurrentTime] = useState(new Date());
    const frameId = useRef<number | null>(null);
    const updateCurrentTime = () => {
        setCurrentTime(new Date());
        frameId.current = requestAnimationFrame(updateCurrentTime);
    };
    useEffect(() => {
        frameId.current = requestAnimationFrame(updateCurrentTime);
        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, []);

    const clockView = useMemo(() => <ClockView currentTime={currentTime} />, [currentTime.getSeconds()]);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ThemedView style={styles.dateTimeContainer}>
                <ThemedText type="subtitle">
                    {currentTime.toLocaleDateString('en-GB')}
                </ThemedText>
                <ThemedText type="title">
                    {currentTime.toLocaleTimeString('en-GB')}
                </ThemedText>
            </ThemedView>
            {clockView}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#141414',
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});
