import { Region, stationRegions } from "@/constants/BusData";
import { DropdownItem, LocationPicker } from "@/components/LocationPicker";
import { useEffect, useState } from "react";
import { FromTo, LocationNullable } from "@/backend/Bus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

const data: DropdownItem[] = (() => {
    const entries: DropdownItem[] = [];
    (Object.keys(stationRegions) as Region[]).forEach(region => {
        entries.push({ type: 'region', label: region, value: region });
        stationRegions[region].forEach(station => {
            entries.push({ type: 'station', label: station, value: station });
        });
    });
    return entries;
})();

type JourneyPlannerProps = {
    fromTo: FromTo;
    setFromTo: (fromTo: FromTo) => void;
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
            case fromLocation && toLocation && fromLocation === toLocation:
                return 'start = end !';
            case fromLocation === Region.MISCELLANEOUS || toLocation === Region.MISCELLANEOUS:
                hideArrow = true;
                return 'choosing miscellaneous is not recommended';
            default:
                return null;
        }
    })();

    return (
        <>
            <LocationPicker
                data={data}
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
                data={data}
                label={'To'}
                location={toLocation}
                setLocation={setToLocation}
                dropdownOpened={toDropdownOpened}
                setDropdownOpened={setToDropdownOpened}
                onOpen={toOnOpen}
            />
        </>
    );
}

const styles = StyleSheet.create({
    middleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        zIndex: 2,
    },
    warningText: {
        position: 'absolute',
        right: 0,
        fontWeight: 'bold',
        textAlign: 'right',
    }
});