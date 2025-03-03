import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
    const { theme } = useTheme();

    const inactiveColour = theme.lowContrast;
    const activeColour = theme.highContrast;

    const tabBarIcon = (name: ComponentProps<typeof MaterialIcons>['name'], focused: boolean) => {
        return <MaterialIcons
            name={name}
            size={28}
            color={focused ? activeColour : inactiveColour}
        />;
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab, //TODO: implement one that looks better
                tabBarActiveTintColor: activeColour,
                tabBarInactiveTintColor: inactiveColour,
                tabBarActiveBackgroundColor: theme.background,
                tabBarInactiveBackgroundColor: theme.background,
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
    );
}