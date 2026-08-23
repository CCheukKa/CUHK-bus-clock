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
import RoutesScreen from '@/app/routesScreen';
import { ThemedText } from '@/components/common/ThemedText';

export enum Font {
    KlintRounded300 = 'KlintRounded300',
    KlintRounded400 = 'KlintRounded400',
    KlintRounded500 = 'KlintRounded500',
    KlintRounded600 = 'KlintRounded600',
    KlintRounded700 = 'KlintRounded700',
    KlintRounded800 = 'KlintRounded800',
    KlintRounded900 = 'KlintRounded900',
}

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const [loaded] = useFonts({
        [Font.KlintRounded300]: require('@/assets/fonts/KlintRounded300Light.ttf'),
        [Font.KlintRounded400]: require('@/assets/fonts/KlintRounded400Regular.ttf'),
        [Font.KlintRounded500]: require('@/assets/fonts/KlintRounded500Medium.ttf'),
        [Font.KlintRounded600]: require('@/assets/fonts/KlintRounded600SemiBold.ttf'),
        [Font.KlintRounded700]: require('@/assets/fonts/KlintRounded700Bold.ttf'),
        [Font.KlintRounded800]: require('@/assets/fonts/KlintRounded800ExtraBold.ttf'),
        [Font.KlintRounded900]: require('@/assets/fonts/KlintRounded900Black.ttf'),
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
            <StatusBar style="light" />
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

    const [index, setIndex] = useState(2); //^ Default to clock screen
    const [routes] = useState<{ key: string, title: string, focusedIcon: IconGlyphsType, unfocusedIcon: IconGlyphsType }[]>([
        { key: 'about', title: 'About', focusedIcon: 'information', unfocusedIcon: 'information-outline' },
        { key: 'routes', title: 'Routes', focusedIcon: 'routes-clock', unfocusedIcon: 'routes' },
        { key: 'clock', title: 'Clock', focusedIcon: 'clock-time-four', unfocusedIcon: 'clock-time-four-outline' },
        { key: 'settings', title: 'Settings', focusedIcon: 'settings-sharp', unfocusedIcon: 'settings-outline' },
    ]);
    const renderScene = BottomNavigation.SceneMap({
        about: AboutScreen,
        routes: RoutesScreen,
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
            theme={{
                dark: true,
                colors: {
                    background: theme.background,
                },
            }}
            renderLabel={({ route, focused }) => (
                <ThemedText style={{
                    textAlign: 'center',
                    elevation: 0,
                    color: focused ? theme.highContrast : theme.lowContrast,
                    backgroundColor: theme.background,
                }}>
                    {route.title}
                </ThemedText>
            )}
        />
    );
}