import { Region, Station } from "@/constants/BusData";
import { ThemeColours } from "@/constants/ThemeColours";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export type DropdownItem = {
    type: 'region' | 'station';
    label: string;
    value: string;
};

type LocationPickerProps = {
    label: string;
    data: DropdownItem[];
    location: Station | Region | null;
    setLocation: (location: Station | Region | null) => void;
};

export function LocationPicker({ label, data, location, setLocation }: LocationPickerProps) {
    const [dropdownExpanded, setDropdownExpanded] = useState(false);
    const dropdownChange = useCallback((item: DropdownItem) => {
        console.log(item);
        setLocation(item.value as Station | Region);
        setDropdownExpanded(false);
    }, []);

    const dropdownListItem = (item: any, selected?: boolean) => {
        const dropdownItem = item as DropdownItem;
        const isRegion = dropdownItem.type === 'region';
        return (
            <View style={[
                styles.dropdownItem,
                selected ? { backgroundColor: ThemeColours.highContrast } : null
            ]}>
                {isRegion
                    ? <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={24}
                        style={{
                            color: selected ? ThemeColours.dimContrast : ThemeColours.highContrast
                        }}
                    />
                    : <MaterialCommunityIcons
                        name="subdirectory-arrow-right"
                        size={24}
                        style={{
                            color: selected ? ThemeColours.dimContrast : ThemeColours.highContrast,
                            marginLeft: 24
                        }}
                    />
                }
                <Text style={[
                    styles.dropdownItemText,
                    {
                        color: selected ? ThemeColours.dimContrast : ThemeColours.highContrast,
                        fontWeight: isRegion ? 'bold' : 'normal',
                        fontSize: isRegion ? 18 : 14,
                    }
                ]}>
                    {dropdownItem.label}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.dropdownContainer}>
            <View style={styles.dropdownLabel}>
                <MaterialCommunityIcons name="bus-stop" size={24} color={ThemeColours.highContrast} />
                <Text style={styles.dropdownLabelText}>{label}</Text>
            </View>
            <Dropdown
                data={data}
                value={location}
                labelField="label"
                valueField="value"
                onChange={dropdownChange}
                placeholder="Select a station/region"
                placeholderStyle={styles.dropdownPlaceholder}
                containerStyle={styles.dropdownListContainer}
                style={[
                    styles.dropdownBar,
                    dropdownExpanded
                        ? {
                            borderBottomStartRadius: 0,
                            borderBottomEndRadius: 0
                        }
                        : null
                ]}
                selectedTextStyle={styles.dropdownSelectedText}
                renderRightIcon={() => <MaterialIcons name="arrow-drop-down" size={24} color={ThemeColours.highContrast} />}
                onFocus={() => { setDropdownExpanded(true); }}
                onBlur={() => { setDropdownExpanded(false); }}
                renderItem={dropdownListItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dropdownContainer: {
        height: '6%',
        width: '80%',
    },
    dropdownLabel: {
        position: 'absolute',
        top: -10,
        left: -10,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dropdownLabelText: {
        color: ThemeColours.highContrast,
        fontWeight: 'bold',
    },
    dropdownBar: {
        height: '100%',
        width: '100%',
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: ThemeColours.dimContrast,
    },
    dropdownPlaceholder: {
        color: ThemeColours.dimContrast,
    },
    dropdownListContainer: {
        backgroundColor: ThemeColours.dimContrast,
        borderColor: ThemeColours.highContrast,
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
        borderRadius: 8,
        borderWidth: 2,
        paddingVertical: 8,
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        margin: 0,
        color: ThemeColours.highContrast,
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemText: {
        marginLeft: 4,
    },
    dropdownSelectedText: {
        color: ThemeColours.highContrast,
        fontWeight: 'bold',
    }
});