import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColourScheme } from '@/hooks/useColourScheme';
import { ThemeColours } from '@/constants/ThemeColours';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    const colourScheme = useColourScheme();

    return (
        <Tabs
            initialRouteName='clockScreen' //? This doesn't seem to work
            screenOptions={{
                tabBarActiveTintColor: ThemeColours.highContrast,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>

            <Tabs.Screen
                //? This is a workaround for the initialRouteName not working
                name="index"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="infoScreen"
                options={{
                    title: 'Info',
                    tabBarIcon: ({ color: colour }) => (
                        <MaterialIcons name="info-outline" size={28} color={colour} />
                    ),
                }}
            />
            <Tabs.Screen
                name="clockScreen"
                options={{
                    title: 'Clock',
                    tabBarIcon: ({ color: colour }) => (
                        <MaterialIcons name="access-time" size={28} color={colour} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settingsScreen"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color: colour }) => (
                        <MaterialIcons name="settings" size={28} color={colour} />
                    ),
                }}
            />
        </Tabs>
    );
}
