import { Region, Station } from "@/constants/BusData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker, { RenderListItemPropsInterface } from "react-native-dropdown-picker";

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
export function LocationPicker({ label: dropdownLabel, data: dropdownData, location, setLocation }: LocationPickerProps) {
    const { settings } = useSettings();
    const { theme } = useTheme();

    const [dropdownOpened, setDropdownOpened] = useState(false);
    const [dropdownItems, setDropdownItems] = useState(dropdownData);
    const [dropdownValue, setDropdownValue] = useState(location);

    return (
        <View style={styles.dropdownContainer}>
            <View style={[
                styles.dropdownLabel,
                {
                    backgroundColor: dropdownOpened
                        ? 'transparent'
                        : theme.background,
                },
            ]}>
                <MaterialCommunityIcons
                    name="bus-stop"
                    size={24}
                    color={dropdownOpened ? theme.highContrast : theme.halfContrast}
                />
                <Text style={[
                    styles.dropdownLabelText,
                    { color: dropdownOpened ? theme.highContrast : theme.halfContrast },
                ]}>
                    {dropdownLabel}
                </Text>
            </View>
            <DropDownPicker
                open={dropdownOpened}
                value={dropdownValue}
                items={dropdownItems}
                setOpen={setDropdownOpened}
                setValue={setDropdownValue}
                setItems={setDropdownItems}
                placeholder="Select a station/region"
                placeholderStyle={[
                    styles.dropdownPlaceholder,
                    { color: theme.lowContrast },
                ]}
                dropDownDirection="BOTTOM"
                listMode={settings.locationPickerUseModal ? "MODAL" : "SCROLLVIEW"}
                modalTitle={dropdownLabel}
                modalTitleStyle={[
                    styles.dropdownModalTitle,
                    { color: theme.highContrast },
                ]}
                modalAnimationType="slide"
                modalContentContainerStyle={{
                    backgroundColor: theme.background,
                    gap: 16,
                    paddingBottom: 16,
                }}
                style={[
                    styles.dropdownBar,
                    {
                        backgroundColor: dropdownOpened
                            ? theme.dimContrast
                            : theme.background,
                        borderColor: theme.dimContrast,
                    },
                ]}
                textStyle={[
                    styles.dropdownText,
                    { color: theme.highContrast },
                ]}
                dropDownContainerStyle={[
                    styles.dropdownListContainer,
                    {
                        backgroundColor: theme.dimContrast,
                        borderColor: theme.dimContrast,
                    },
                ]}
                renderListItem={dropdownListItem}
            />
        </View >
    );

    /* -------------------------------------------------------------------------- */
    function dropdownListItem({
        item,
        isSelected,
        onPress,
        ...otherProps
    }: RenderListItemPropsInterface<string>) {

        const listItem = item as DropdownItem;
        const isRegion = listItem.type === 'region';
        return (
            <TouchableOpacity
                {...otherProps}
                onPress={() => {
                    onPress(listItem.value);
                    setDropdownValue(listItem.value as Station | Region);
                    setLocation(listItem.value as Station | Region);
                }}
                style={[
                    styles.dropdownItem,
                    isSelected ? { backgroundColor: theme.highContrast } : null
                ]}
                key={listItem.value}
            >
                {isRegion
                    ? <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={24}
                        style={{
                            color: isSelected ? theme.dimContrast : theme.highContrast
                        }}
                    />
                    : <MaterialCommunityIcons
                        name="subdirectory-arrow-right"
                        size={24}
                        style={{
                            color: isSelected ? theme.dimContrast : theme.highContrast,
                            marginLeft: 24
                        }}
                    />
                }
                <Text style={[
                    styles.dropdownItemText,
                    {
                        color: isSelected ? theme.dimContrast : theme.highContrast,
                        fontWeight: isRegion || isSelected ? 'bold' : 'normal',
                        borderBottomColor: theme.dimContrast,
                        borderBottomWidth: isSelected ? 1.5 : 0,
                        fontSize: isRegion ? 16 : undefined,
                    }
                ]}>
                    {listItem.label}
                </Text>
            </TouchableOpacity>
        );
    }
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingRight: 6,
        zIndex: 10,
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
        zIndex: 1,
    },
    dropdownPlaceholder: {
        fontWeight: 'bold',
    },
    dropdownListContainer: {
        borderWidth: 2,
        paddingVertical: 8,
    },
    dropdownModalTitle: {
        fontWeight: 'bold',
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        margin: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemText: {
        marginLeft: 4,
    },
    dropdownText: {
        fontWeight: 'bold',
    },
});