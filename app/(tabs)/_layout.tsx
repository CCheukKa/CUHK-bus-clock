import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColourScheme } from '@/hooks/useColourScheme';
import { Colours } from '@/constants/Colours';

export default function TabLayout() {
    const colourScheme = useColourScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colours[colourScheme ?? 'light'].tint,
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
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color: colour }) => <IconSymbol size={28} name="house.fill" colour={colour} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color: colour }) => <IconSymbol size={28} name="paperplane.fill" colour={colour} />,
                }}
            />
            <Tabs.Screen
                name="clock"
                options={{
                    title: 'Clock',
                    tabBarIcon: ({ color: colour }) => <IconSymbol size={28} name="clock.fill" colour={colour} />,
                }}
            />
        </Tabs>
    );
}
