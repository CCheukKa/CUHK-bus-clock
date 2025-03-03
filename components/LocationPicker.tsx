import { Region, Station } from "@/constants/BusData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    setLocation: React.Dispatch<React.SetStateAction<Station | Region | null>>;
    dropdownOpened: boolean;
    setDropdownOpened: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
};
export function LocationPicker({
    label: pickerLabel,
    data: pickerData,
    location, setLocation,
    dropdownOpened, setDropdownOpened,
    onOpen
}: LocationPickerProps) {

    const { settings } = useSettings();
    const { theme } = useTheme();

    const [dropdownItems, setDropdownItems] = useState(pickerData);
    const [dropdownValue, setDropdownValue] = useState(location);

    const dropdownContainerRef = useRef<View>(null);
    const [distanceFromBottom, setDistanceFromBottom] = useState(200);
    useEffect(() => {
        measurePosition();
        const subscription = Dimensions.addEventListener('change', measurePosition);
        return subscription.remove;
    }, []);
    const measurePosition = () => {
        const screenHeight = Dimensions.get('window').height;

        if (!dropdownContainerRef.current) { return; }
        dropdownContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
            const bottomEdgeOfComponent = pageY + height;
            const distanceFromBottom = screenHeight - bottomEdgeOfComponent;
            setDistanceFromBottom(distanceFromBottom);
        });
    };

    return (
        <View
            style={styles.dropdownContainer}
            ref={dropdownContainerRef}
            onLayout={measurePosition}
        >
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
                    {pickerLabel}
                </Text>
            </View>
            <DropDownPicker
                onOpen={onOpen}
                open={dropdownOpened}
                value={dropdownValue}
                items={dropdownItems}
                setOpen={setDropdownOpened}
                setValue={setDropdownValue}
                setItems={setDropdownItems}
                closeOnBackPressed={true}
                placeholder="Select a station/region"
                placeholderStyle={[
                    styles.dropdownPlaceholder,
                    { color: theme.lowContrast },
                ]}
                dropDownDirection="BOTTOM"
                maxHeight={distanceFromBottom - 34}
                listMode={settings.locationPickerUseModal ? "MODAL" : "SCROLLVIEW"}
                modalTitle={pickerLabel}
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
                        borderColor: theme.lowContrast,
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