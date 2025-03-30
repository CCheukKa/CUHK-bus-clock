import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { BottomNavigation } from 'react-native-paper';
import ClockScreen from '@/app/clockScreen';
import AboutScreen from '@/app/aboutScreen';
import SettingsScreen from '@/app/settingsScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconGlyphs, IconGlyphsType } from '@/utils/Helper';
import { ResponsiveProvider } from '@/context/ResponsiveContext';

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    /* -------------------------------------------------------------------------- */

    return (
        <>
            <StatusBar style="auto" />
            <PaperProvider
                settings={{
                    icon: ({ name, ...otherProps }) => {
                        if (IconGlyphs.isMaterialCommunityIcons(name)) {
                            return <MaterialCommunityIcons name={name} {...otherProps} />;
                        } else if (IconGlyphs.isIonicons(name)) {
                            return <Ionicons name={name} {...otherProps} />;
                        } else {
                            return null;
                        }
                    }
                }}
            >
                <SettingsProvider>
                    <ThemeProvider>
                        <ResponsiveProvider>
                            <WithinProviders />
                        </ResponsiveProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </PaperProvider>
        </>
    );
}

function WithinProviders() {
    const { theme } = useTheme();

    const [index, setIndex] = useState(1);
    const [routes] = useState<{ key: string, title: string, focusedIcon: IconGlyphsType, unfocusedIcon: IconGlyphsType }[]>([
        { key: 'about', title: 'About', focusedIcon: 'information', unfocusedIcon: 'information-outline' },
        { key: 'clock', title: 'Clock', focusedIcon: 'clock-time-four', unfocusedIcon: 'clock-time-four-outline' },
        { key: 'settings', title: 'Settings', focusedIcon: 'settings-sharp', unfocusedIcon: 'settings-outline' },
    ]);
    const renderScene = BottomNavigation.SceneMap({
        about: AboutScreen,
        clock: ClockScreen,
        settings: SettingsScreen,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled={true}
            sceneAnimationType='shifting'
            barStyle={{
                backgroundColor: theme.background,
                borderTopColor: theme.dimContrast,
                borderTopWidth: 1,
                borderStyle: 'dashed',
            }}
            activeColor={theme.highContrast}
            inactiveColor={theme.lowContrast}
            activeIndicatorStyle={{ backgroundColor: theme.dimContrast }}
            keyboardHidesNavigationBar={false}
        />
    );
}