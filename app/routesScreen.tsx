import { FullscreenView } from '@/components/common/FullscreenView';
import { ThemedText } from '@/components/common/ThemedText';
import { BusRoute, busRouteInfos, busStationTimings, Station } from '@/constants/BusData';
import { useTheme } from '@/context/ThemeContext';
import { Colour, MathExtra, toTimeString } from '@/utils/Helper';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

enum StationInfoType {
    TOP,
    MIDDLE,
    BOTTOM,
};
type StationInfoProps = {
    type: StationInfoType
    station: Station
    stationTimingOffset: number
};
const STATION_HEIGHT = 32;
function StationInfo({ type, station, stationTimingOffset }: StationInfoProps) {
    const { theme } = useTheme();

    return (
        <View style={stationInfoStyles.container}>
            <View style={stationInfoStyles.routeLineContainer}>
                <View style={[
                    stationInfoStyles.line,
                    type === StationInfoType.TOP ? { top: '50%' } : {},
                    type === StationInfoType.BOTTOM ? { bottom: '50%' } : {},
                    { backgroundColor: theme.dimContrast },
                ]} />
                <View style={[
                    stationInfoStyles.dot,
                    {
                        backgroundColor: theme.dimContrast,
                        borderColor: theme.lowContrast,
                    },
                ]} />
            </View>
            <View style={[
                stationInfoStyles.stationNameContainer,
                type === StationInfoType.TOP ? { borderTopWidth: 0 } : {},
                type === StationInfoType.BOTTOM ? { borderBottomWidth: 0 } : {},
                {
                    borderColor: theme.dimContrast,
                },
            ]}>
                <ThemedText type='defaultSemiBold'>
                    {station}
                </ThemedText>
            </View>
            <View style={stationInfoStyles.stationTimingContainer}>
                <ThemedText type='defaultSemiBold'>
                    {`+${toTimeString(Math.round(stationTimingOffset))}`}
                </ThemedText>
            </View>
        </View>
    );
}

type StationInfosProps = {
    route: BusRoute,
};
function StationInfos({ route }: StationInfosProps) {
    let stationTimingOffset = 0;
    const stationInfos: React.JSX.Element[] = [];
    for (let i = 0; i < busRouteInfos[route].stations.length; i++) {
        const thisStation = busRouteInfos[route].stations[i];
        const previousStation = i > 0 ? busRouteInfos[route].stations[i - 1] : null;
        const busStationTiming = busStationTimings[`${previousStation}>>${thisStation}`] ?? [];
        const busStationTimingAverage = busStationTiming.length > 0 ? MathExtra.average(...busStationTiming) : 0;
        stationTimingOffset += busStationTimingAverage;

        stationInfos.push(
            <StationInfo
                key={i}
                type={
                    i === 0
                        ? StationInfoType.TOP
                        : i === busRouteInfos[route].stations.length - 1
                            ? StationInfoType.BOTTOM
                            : StationInfoType.MIDDLE
                }
                station={thisStation}
                stationTimingOffset={stationTimingOffset}
            />
        );
    }
    return stationInfos;
}

type RouteInfoCardProps = {
    route: BusRoute | null,
};
function RouteInfoCard({ route }: RouteInfoCardProps) {
    const { theme } = useTheme();

    const routeColour = route !== null
        ? busRouteInfos[route].routeColour
        : 'transparent';
    const contrastColour = route !== null
        ? (
            Colour.getLuminance(routeColour) > 150
                ? theme.black
                : theme.white
        )
        : theme.text;

    return (<View style={[
        styles.routeInfoCard,
        { backgroundColor: routeColour },
    ]}>
        <View style={[
            routeInfoStyles.routeInfoHeader,
            { backgroundColor: routeColour },
        ]}>
            <View style={routeInfoStyles.routeNumberContainer}>
                <ThemedText
                    type='title'
                    style={{ color: contrastColour }}
                >
                    {route}
                </ThemedText>
            </View>
            <View></View>
        </View>
        <View style={[
            routeInfoStyles.stationInfosContainer,
            {
                backgroundColor: theme.minimalContrast,
                borderColor: routeColour,
            },
        ]}>
            <ScrollView
                style={routeInfoStyles.stationInfosScrollView}
                contentContainerStyle={routeInfoStyles.stationInfosScrollViewContent}
            >
                {route !== null
                    ? <StationInfos route={route} />
                    : null
                }
            </ScrollView>
        </View>
    </View>);
}

export default function RoutesScreen() {
    const { theme } = useTheme();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<keyof typeof BusRoute>('_1A' as keyof typeof BusRoute);
    const [items, setItems] = useState(Object.keys(BusRoute).map(key => { return { label: BusRoute[key as keyof typeof BusRoute], value: key } }));
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(BusRoute._1A);
    useEffect(() => {
        setSelectedRoute(value !== null ? BusRoute[value] : null);
    }, [value]);

    return (
        <FullscreenView>
            <View style={styles.screenContainer}>
                <RouteInfoCard route={selectedRoute} />
                <View style={styles.controlContainer}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={[
                            styles.dropDownPicker,
                            {
                                backgroundColor: theme.minimalContrast,
                                borderColor: theme.dimContrast,
                            },
                        ]}
                        dropDownContainerStyle={{ backgroundColor: theme.minimalContrast }}
                    />
                </View>
            </View>
        </FullscreenView>
    );
}

const ROUTE_INFO_BORDER_RADIUS = 16;
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        gap: 20,
    },
    routeInfoCard: {
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ROUTE_INFO_BORDER_RADIUS,
        overflow: 'hidden',
    },
    controlContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropDownPicker: {
        borderWidth: 2,
        paddingHorizontal: 16,
    },
});

const ROUTE_INFO_HEADER_HEIGHT = 60;
const routeInfoStyles = StyleSheet.create({
    routeInfoHeader: {
        height: ROUTE_INFO_HEADER_HEIGHT,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    routeNumberContainer: {
        height: '100%',
        aspectRatio: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: 5 }],
    },
    stationInfosContainer: {
        width: '100%',
        flex: 1,
        borderBottomLeftRadius: ROUTE_INFO_BORDER_RADIUS,
        borderBottomRightRadius: ROUTE_INFO_BORDER_RADIUS,
        borderWidth: 2,
        borderTopWidth: 0,
    },
    stationInfosScrollView: {
        width: '100%',
    },
    stationInfosScrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
});
const stationInfoStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        gap: 20,
    },
    routeLineContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: STATION_HEIGHT,
    },
    line: {
        position: 'absolute',
        width: 4,
        height: STATION_HEIGHT * 2,
    },
    dot: {
        width: 14,
        zIndex: 1,
        aspectRatio: 1,
        borderRadius: '50%',
        backgroundColor: 'blue',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    stationNameContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingLeft: 8,
    },
    stationTimingContainer: {
        height: '100%',
        width: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});