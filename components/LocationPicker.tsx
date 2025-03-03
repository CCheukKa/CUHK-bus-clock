import { Region, Station } from "@/constants/BusData";
import { Theme } from "@/constants/Themes";
import { useTheme } from "@/context/ThemeContext";
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
    const { theme } = useTheme();

    const [dropdownExpanded, setDropdownExpanded] = useState(false);
    const dropdownChange = useCallback((item: DropdownItem) => {
        setLocation(item.value as Station | Region);
        setDropdownExpanded(false);
    }, []);

    return (
        <View style={styles.dropdownContainer}>
            <View style={[
                styles.dropdownLabel,
                { backgroundColor: theme.background },
            ]}>
                <MaterialCommunityIcons name="bus-stop" size={24} color={theme.highContrast} />
                <Text style={[
                    styles.dropdownLabelText,
                    { color: theme.highContrast },
                ]}>{label}</Text>
            </View>
            <Dropdown
                data={data}
                value={location}
                labelField="label"
                valueField="value"
                onChange={dropdownChange}
                placeholder="Select a station/region"
                placeholderStyle={{ color: theme.dimContrast }}
                containerStyle={[
                    styles.dropdownListContainer,
                    {
                        backgroundColor: theme.dimContrast,
                        borderColor: theme.lowContrast,
                    },
                ]}
                style={[
                    styles.dropdownBar,
                    { borderColor: theme.dimContrast },
                    dropdownExpanded
                        ? {
                            borderBottomStartRadius: 0,
                            borderBottomEndRadius: 0
                        }
                        : null
                ]}
                selectedTextStyle={[
                    styles.dropdownSelectedText,
                    { color: theme.highContrast },
                ]}
                renderRightIcon={() =>
                    dropdownExpanded
                        ? <MaterialIcons name="arrow-drop-up" size={24} color={theme.highContrast} />
                        : <MaterialIcons name="arrow-drop-down" size={24} color={theme.highContrast} />
                }
                onFocus={() => { setDropdownExpanded(true); }}
                onBlur={() => { setDropdownExpanded(false); }}
                renderItem={(item, selected) => dropdownListItem(item, selected ?? false, theme)}
            />
        </View>
    );
}

function dropdownListItem(item: any, selected: boolean, theme: Theme) {
    const dropdownItem = item as DropdownItem;
    const isRegion = dropdownItem.type === 'region';
    return (
        <View
            style={[
                styles.dropdownItem,
                selected ? { backgroundColor: theme.highContrast } : null
            ]}
            key={dropdownItem.value}
        >
            {isRegion
                ? <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={24}
                    style={{
                        color: selected ? theme.dimContrast : theme.highContrast
                    }}
                />
                : <MaterialCommunityIcons
                    name="subdirectory-arrow-right"
                    size={24}
                    style={{
                        color: selected ? theme.dimContrast : theme.highContrast,
                        marginLeft: 24
                    }}
                />
            }
            <Text style={[
                styles.dropdownItemText,
                {
                    color: selected ? theme.dimContrast : theme.highContrast,
                    fontWeight: isRegion ? 'bold' : 'normal',
                    fontSize: isRegion ? 18 : 14,
                }
            ]}>
                {dropdownItem.label}
            </Text>
        </View>
    );
};

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
        paddingRight: 6,
    },
    dropdownLabelText: {
        fontWeight: 'bold',
    },
    dropdownBar: {
        height: '100%',
        width: '100%',
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
    },
    dropdownListContainer: {
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
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemText: {
        marginLeft: 4,
    },
    dropdownSelectedText: {
        fontWeight: 'bold',
    }
});