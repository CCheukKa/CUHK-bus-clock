import { Region, Station, stationRegions } from "@/constants/BusData";
import { DropdownItem, LocationPicker } from "@/components/LocationPicker";
import { useEffect, useState } from "react";
import { FromTo, LocationNullable } from "@/backend/Bus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";


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
// compile this auto?
const termini: Station[] = [
    Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
    Station.CWC_COLLEGE_DOWNWARD_TERMINUS,
    Station.UNIVERSITY_STATION_PIAZZA_TERMINUS,
    Station.UNIVERSITY_STATION_TERMINUS,
];
const fromData: DropdownItem[] = data.filter(item => {
    return !termini.includes(item.value as Station);
});
// compile this auto?
const starts: Station[] = [
    Station.CHUNG_CHI_TEACHING_BUILDING,
    Station.UNIVERSITY_STATION,
    Station.YIA,
];
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

    let hideArrow = false;
    const warningMessage: string | null = (() => {
        hideArrow = false;

        switch (true) {
            case fromTo.from && fromTo.to && fromTo.from === fromTo.to:
                hideArrow = true;
                return 'avoiding choosing same start/end';
            case fromTo.from === Region.MISCELLANEOUS || fromTo.to === Region.MISCELLANEOUS:
                hideArrow = true;
                return 'choosing miscellaneous is not recommended';
            default:
                return null;
        }
    })();

    return (
        <View style={styles.journeyPlannerContainer}>
            <View style={styles.locationPickersContainer}>
                <LocationPicker
                    data={fromData}
                    label={'From'}
                    location={fromLocation}
                    setLocation={setFromLocation}
                    dropdownOpened={fromDropdownOpened}
                    setDropdownOpened={setFromDropdownOpened}
                    onOpen={fromOnOpen}
                />
                <View style={styles.middleContainer}>
                    <View style={{ opacity: fromDropdownOpened || hideArrow ? 0 : 1 }}>
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
                <LocationPicker
                    data={toData}
                    label={'To'}
                    location={toLocation}
                    setLocation={setToLocation}
                    dropdownOpened={toDropdownOpened}
                    setDropdownOpened={setToDropdownOpened}
                    onOpen={toOnOpen}
                />
            </View>
            <View style={styles.swapButtonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setFromLocation(fromTo.to);
                        setToLocation(fromTo.from);
                    }}
                >
                    <MaterialCommunityIcons
                        name="swap-vertical"
                        size={36}
                        color={theme.highContrast}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    journeyPlannerContainer: {
        width: '80%',
    },
    locationPickersContainer: {
        width: '90%',
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
    swapButtonContainer: {
        position: 'absolute',
        top: '50%',
        right: -10,
        transform: [{ translateY: '-50%' }],
        zIndex: 1,
    },
});