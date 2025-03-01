import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { useColourScheme } from '@/hooks/useColourScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeColours } from '@/constants/ThemeColours';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';


export default function TabLayout() {
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
        <Tabs
            initialRouteName='clockScreen' //? This doesn't seem to work
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

const styles = StyleSheet.create({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});