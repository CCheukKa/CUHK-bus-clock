import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colours } from '@/constants/Colours';
import { useColourScheme } from '@/hooks/useColourScheme';

export default function TabLayout() {
    const colourScheme = useColourScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColour: Colours[colourScheme ?? 'light'].tint,
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
                    tabBarIcon: ({ colour }) => <IconSymbol size={28} name="house.fill" colour={colour} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ colour }) => <IconSymbol size={28} name="paperplane.fill" colour={colour} />,
                }}
            />
            <Tabs.Screen
                name="clock"
                options={{
                    title: 'Clock',
                    tabBarIcon: ({ colour }) => <IconSymbol size={28} name="clock.fill" colour={colour} />,
                }}
            />
        </Tabs>
    );
}
