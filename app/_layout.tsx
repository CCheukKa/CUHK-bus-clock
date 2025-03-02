import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeColours } from '@/constants/ThemeColours';
import { ComponentProps } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    const inactiveColour = ThemeColours.lowContrast;
    const activeColour = ThemeColours.highContrast;

    const tabBarIcon = (name: ComponentProps<typeof MaterialIcons>['name'], focused: boolean) => {
        return <MaterialIcons
            name={name}
            size={28}
            color={focused ? activeColour : inactiveColour}
        />;
    };

    return (
        <>
            <StatusBar style="auto" />
            <SettingsProvider>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarButton: HapticTab, //TODO: implement one that looks better
                        tabBarActiveTintColor: activeColour,
                        tabBarInactiveTintColor: inactiveColour,
                        tabBarActiveBackgroundColor: ThemeColours.background,
                        tabBarInactiveBackgroundColor: ThemeColours.background,
                        tabBarLabelStyle: {
                            fontWeight: 'bold',
                        },
                    }}>

                    <Tabs.Screen
                        name="index"
                        options={{
                            href: null,
                        }}
                    />

                    <Tabs.Screen
                        name="infoScreen"
                        options={{
                            title: 'Info',
                            tabBarIcon: ({ focused }) => tabBarIcon('info-outline', focused),
                        }}
                    />
                    <Tabs.Screen
                        name="clockScreen"
                        options={{
                            title: 'Clock',
                            tabBarIcon: ({ focused }) => tabBarIcon('access-time', focused),
                        }}
                    />
                    <Tabs.Screen
                        name="settingsScreen"
                        options={{
                            title: 'Settings',
                            tabBarIcon: ({ focused }) => tabBarIcon('settings', focused),
                        }}
                    />
                </Tabs>
            </SettingsProvider>
        </>
    );
}