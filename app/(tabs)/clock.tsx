import React, { useEffect, useState, useRef } from 'react';
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

    return (
        <SafeAreaView style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#141414',
        }}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">
                    {currentTime.toLocaleTimeString('en-GB')}
                </ThemedText>
            </ThemedView>
            <ClockView currentTime={currentTime} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
