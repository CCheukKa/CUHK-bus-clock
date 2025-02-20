import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Image, Platform, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ClockView } from '@/components/ClockView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClockThing } from '@/components/ClockThing';

export default function ClockScreen() {

    //^ This is very jank

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB'));
    const frameId = useRef<number | null>(null);

    const updateCurrentTime = () => {
        setCurrentTime(new Date().toLocaleTimeString('en-GB'));
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
                    {currentTime}
                </ThemedText>
            </ThemedView>
            <ClockView>
                {/* <ClockThing /> */}
            </ClockView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
