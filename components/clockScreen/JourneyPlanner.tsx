import { Region, starts, Station, stationRegions, termini } from "@/constants/BusData";
import { DropdownItem, LocationPicker } from "@/components/clockScreen/LocationPicker";
import { useEffect, useMemo, useState } from "react";
import { FromTo, getRegionFromGPS, getStationFromGPS, LocationNullable } from "@/utils/Bus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import * as Location from "expo-location";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const data: DropdownItem[] = (() => {
    const entries: DropdownItem[] = [];
    for (const r in stationRegions) {
        const region = r as Region;

        entries.push({ type: 'region', label: region, value: region });
        for (const station of stationRegions[region]) {
            entries.push({ type: 'station', label: station, value: station });
        }
    }
    return entries;
})();

const fromData: DropdownItem[] = data.filter(item => {
    return !termini.includes(item.value as Station);
});
const toData: DropdownItem[] = data.filter(item => {
    return !starts.includes(item.value as Station);
});

type JourneyPlannerProps = {
    fromTo: FromTo;
    setFromTo: React.Dispatch<React.SetStateAction<FromTo>>;
};
export function JourneyPlanner({ fromTo, setFromTo }: JourneyPlannerProps) {
    const { theme } = useTheme();

    const [fromLocation, setFromLocation] = useState<LocationNullable>(fromTo.from);
    const [toLocation, setToLocation] = useState<LocationNullable>(fromTo.to);
    useEffect(() => {
        if (fromLocation && toLocation) { setFromTo({ from: fromLocation, to: toLocation }); }
    }, [fromLocation, toLocation]);

    const [fromDropdownOpened, setFromDropdownOpened] = useState(false);
    const [toDropdownOpened, setToDropdownOpened] = useState(false);

    const fromOnOpen = () => { setToDropdownOpened(false); };
    const toOnOpen = () => { setFromDropdownOpened(false); };

    let showingWarningMessage = false;
    const warningMessage: string | null = (() => {
        showingWarningMessage = false;

        switch (true) {
            case fromTo.from && fromTo.to && fromTo.from === fromTo.to:
                showingWarningMessage = true;
                return 'avoid choosing same start/end';
            case fromTo.from === Region.MISCELLANEOUS || fromTo.to === Region.MISCELLANEOUS:
                showingWarningMessage = true;
                return 'choosing miscellaneous is not recommended';
            default:
                return null;
        }
    })();

    const [gpsQuerying, setGpsQuerying] = useState<boolean>(false);
    const gpsSpinnerRotation = useSharedValue(0);
    useEffect(() => {
        if (gpsQuerying) {
            gpsSpinnerRotation.value = 0;
            gpsSpinnerRotation.value = withRepeat(
                withTiming(360, {
                    duration: 1000,
                    easing: Easing.linear
                }),
                -1,
                false
            );
        } else {
            cancelAnimation(gpsSpinnerRotation);
        }
    }, [gpsQuerying]);
    const gpsSpinnerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateZ: `${gpsSpinnerRotation.value}deg` },
                { scale: 2 },
            ],
            opacity: gpsQuerying ? 1 : 0,
        };
    });

    return (
        <View style={styles.journeyPlannerContainer}>
            <View style={styles.locationPickersContainer}>
                {useMemo(() =>
                    <LocationPicker
                        data={fromData}
                        label={'From'}
                        location={fromLocation}
                        setLocation={setFromLocation}
                        dropdownOpened={fromDropdownOpened}
                        setDropdownOpened={setFromDropdownOpened}
                        onOpen={fromOnOpen}
                    />, [fromLocation, fromDropdownOpened]
                )}
                <View style={styles.middleContainer}>
                    <View style={{ opacity: fromDropdownOpened || showingWarningMessage ? 0 : 1 }}>
                        <MaterialCommunityIcons
                            name="arrow-down-thin"
                            size={24}
                            color={theme.halfContrast}
                            style={{
                                zIndex: 1,
                                transform: [{ scale: 2.5 }],
                            }}
                        />
                        <MaterialCommunityIcons
                            name="arrow-down-thin"
                            size={24}
                            color={theme.background}
                            style={{
                                position: 'absolute',
                                transform: [{ scale: 2.5 }, { translateY: 1.2 }],
                            }}
                        />
                    </View>
                    <Text
                        style={[
                            styles.warningText,
                            { color: theme.primary },
                        ]}
                    >
                        {warningMessage}
                    </Text>
                </View>
                {useMemo(() =>
                    <LocationPicker
                        data={toData}
                        label={'To'}
                        location={toLocation}
                        setLocation={setToLocation}
                        dropdownOpened={toDropdownOpened}
                        setDropdownOpened={setToDropdownOpened}
                        onOpen={toOnOpen}
                    />
                    , [toLocation, toDropdownOpened]
                )}
            </View>
            <View style={styles.gpsButtonContainer}>
                <Animated.View style={[styles.gpsSpinner, gpsSpinnerAnimatedStyle]}>
                    <MaterialCommunityIcons
                        name="loading"
                        size={24}
                        color={theme.primarySharp}
                    />
                </Animated.View>
                <TouchableOpacity
                    onPress={() => {
                        if (gpsQuerying) { return; }
                        setGpsQuerying(true);
                        console.log('[JourneyPlanner][GPS] gps queried');
                        getCurrentLocation()
                            .then(gpsLocation => {
                                console.log(`[JourneyPlanner][GPS] GPS Location: ${gpsLocation}`);
                                if (!gpsLocation) { throw new Error('[JourneyPlanner][GPS] Location is null'); }
                                const location: LocationNullable = getRegionFromGPS(gpsLocation.coords) || getStationFromGPS(gpsLocation.coords);
                                console.log(`[JourneyPlanner][GPS] Location: ${location}`);
                                if (!location) { throw new Error('[JourneyPlanner][GPS] Location is null'); }
                                setFromLocation(location);
                                ToastAndroid.show('Set start to current location', ToastAndroid.SHORT);
                            }).catch(err => {
                                console.warn(err);
                                ToastAndroid.show('Failed to get current location', ToastAndroid.SHORT);
                            }).finally(() => {
                                setGpsQuerying(false);
                            });
                    }}
                >
                    <MaterialCommunityIcons
                        name="crosshairs-gps"
                        size={28}
                        color={gpsQuerying ? theme.primaryHeavy : theme.lowContrast}
                    />
                </TouchableOpacity>
            </View>
            <View style={[
                styles.swapButtonContainer,
                { opacity: showingWarningMessage ? 0 : 1 },
            ]}>
                <TouchableOpacity
                    onPress={() => {
                        setFromLocation(fromTo.to);
                        setToLocation(fromTo.from);
                    }}
                >
                    <MaterialCommunityIcons
                        name="swap-vertical"
                        size={36}
                        color={theme.lowContrast}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
    }
    const location = await Location.getLastKnownPositionAsync({ maxAge: 20000 });
    if (location !== null) { return location; }
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
}

const styles = StyleSheet.create({
    journeyPlannerContainer: {
        width: '80%',
    },
    locationPickersContainer: {
        width: '100%',
    },
    middleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 2,
    },
    warningText: {
        position: 'absolute',
        right: 0,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    gpsSpinner: {
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
        aspectRatio: 1,
    },
    gpsButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -10,
        right: -28,
        transform: [{ translateY: '-50%' }],
        zIndex: 1,
    },
    swapButtonContainer: {
        position: 'absolute',
        top: '50%',
        right: -32,
        transform: [{ translateY: '-50%' }],
        zIndex: 1,
    },
});