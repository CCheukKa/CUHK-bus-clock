import { Region, Station, stationRegions } from "@/constants/BusData";
import { DropdownItem, LocationPicker } from "@/components/LocationPicker";
import { useEffect, useState } from "react";
import { FromTo, LocationNullable } from "@/api/Bus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemeColours } from "@/constants/ThemeColours";

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
    const [fromLocation, setFromLocation] = useState<LocationNullable>(fromTo.from);
    const [toLocation, setToLocation] = useState<LocationNullable>(fromTo.to);

    useEffect(() => {
        if (fromLocation && toLocation) { setFromTo({ from: fromLocation, to: toLocation }); }
    }, [fromLocation, toLocation]);

    return (
        <>
            <LocationPicker data={data} label={'From'} location={fromLocation} setLocation={setFromLocation} />
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <MaterialCommunityIcons
                    name="arrow-down-thin"
                    size={24}
                    color={ThemeColours.halfContrast}
                    style={{
                        zIndex: 2,
                        transform: [{ scale: 2.5 }],
                    }}
                />
                <MaterialCommunityIcons
                    name="arrow-down-thin"
                    size={28}
                    color={ThemeColours.lowContrast}
                    style={{
                        zIndex: 1,
                        position: 'absolute',
                        transform: [{ scale: 2.5 }],
                    }}
                />
            </View>
            <LocationPicker data={data} label={'To'} location={toLocation} setLocation={setToLocation} />
        </>
    );
}