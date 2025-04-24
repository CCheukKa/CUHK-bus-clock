import { LocationNullable } from "@/utils/Bus";
import { Region } from "@/constants/BusData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { FontSizes } from "@/utils/Typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker, { RenderListItemPropsInterface } from "react-native-dropdown-picker";
import { NAVIGATION_BAR_HEIGHT } from "@/constants/UI";

export type DropdownItem = {
    type: 'region' | 'station';
    label: string;
    value: string;
};

type LocationPickerProps = {
    label: string;
    data: DropdownItem[];
    location: LocationNullable;
    setLocation: React.Dispatch<React.SetStateAction<LocationNullable>>;
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

    const dropdownContainerRef = useRef<View>(null);
    const [distanceFromBottom, setDistanceFromBottom] = useState(200);

    if (!settings.useFullscreenLocationPicker) {
        (() => { //* measurePosition()
            console.log('[LocationPicker][measurePosition] Measuring position');
            const screenHeight = Dimensions.get('window').height;
            if (!dropdownContainerRef.current) { return; }
            dropdownContainerRef.current.measure((_x, _y, _width, height, _pageX, pageY) => {
                const bottomEdgeOfComponent = pageY + height;
                const newDistanceFromBottom = screenHeight - bottomEdgeOfComponent - NAVIGATION_BAR_HEIGHT - 8;
                if (distanceFromBottom !== newDistanceFromBottom) {
                    setDistanceFromBottom(newDistanceFromBottom);
                }
            });
        })();
    }

    return (
        <View
            style={styles.dropdownContainer}
            ref={dropdownContainerRef}
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
                value={location}
                items={dropdownItems}
                setOpen={setDropdownOpened}
                setValue={() => { }}
                setItems={setDropdownItems}
                closeOnBackPressed={true}
                placeholder="Select a station/region"
                placeholderStyle={[
                    styles.dropdownPlaceholder,
                    { color: theme.lowContrast },
                ]}
                dropDownDirection="BOTTOM"
                maxHeight={distanceFromBottom - 34}
                listMode={settings.useFullscreenLocationPicker ? "MODAL" : "SCROLLVIEW"}
                modalTitle={pickerLabel}
                modalTitleStyle={[
                    styles.dropdownModalTitle,
                    { color: theme.highContrast },
                ]}
                modalAnimationType="slide"
                modalContentContainerStyle={{
                    backgroundColor: theme.minimalContrast,
                    gap: 16,
                    paddingBottom: 16,
                }}
                style={[
                    styles.dropdownBar,
                    {
                        backgroundColor: dropdownOpened
                            ? theme.dimContrast
                            : theme.minimalContrast,
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
                    setLocation(listItem.value as LocationNullable);
                }}
                style={[
                    styles.dropdownItem,
                    isSelected ? { backgroundColor: theme.highContrast } : null
                ]}
                key={listItem.value}
            >
                <View style={styles.dropdownItemMain}>
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
                            fontSize: isRegion ? FontSizes.small : undefined,
                        }
                    ]}>
                        {listItem.label}
                    </Text>
                </View>
                {
                    listItem.value === Region.MISCELLANEOUS
                        ? <Text style={{
                            color: isSelected ? theme.primarySharp : theme.primary,
                            fontWeight: isSelected ? 'bold' : 'normal',
                        }}>Choose a station instead</Text>
                        : null
                }
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    dropdownContainer: {
        height: 48,
        width: '100%',
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
        borderRadius: 4,
    },
    dropdownLabelText: {
        fontWeight: 'bold',
    },
    dropdownBar: {
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
        justifyContent: 'space-between',
    },
    dropdownItemText: {
        marginLeft: 4,
    },
    dropdownText: {
        fontWeight: 'bold',
    },
    dropdownItemMain: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});