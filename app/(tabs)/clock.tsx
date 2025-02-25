import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ClockView } from '@/components/ClockView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

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
            <View style={styles.headerContainer}>
                <ThemedView style={styles.dateTimeContainer}>
                    <ThemedText type="subtitle">
                        {currentTime.toLocaleDateString('en-GB')}
                    </ThemedText>
                    <ThemedText type="title">
                        {currentTime.toLocaleTimeString('en-GB')}
                    </ThemedText>
                </ThemedView>
                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={() => { }}
                        style={({ pressed }) => [
                            {
                                // backgroundColor: pressed ? 'lightgreen' : 'lightseagreen',
                                // backgroundColor: pressed ? 'deepskyblue' : 'dodgerblue',
                                backgroundColor: pressed ? 'mediumvioletred' : 'palevioletred',
                            },
                            styles.button,
                        ]}>
                        <FontAwesome6 name="clock-rotate-left" color="#ffffff" size={20} />
                    </Pressable>
                </View>
            </View>
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
