import { FullscreenView } from '@/components/common/FullscreenView';
import { ThemedText } from '@/components/common/ThemedText';
import { BusRoute, busRouteGroups, busRouteInfos, busStationTimings, Station } from '@/constants/BusData';
import { useTheme } from '@/context/ThemeContext';
import { Colour, MathExtra, toTimeString } from '@/utils/Helper';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WEEK_DAYS } from '@/constants/UI';

const enum StationInfoType {
    TOP = 'top',
    MIDDLE = 'middle',
    BOTTOM = 'bottom',
}
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
                <ThemedText>
                    {station}
                </ThemedText>
            </View>
            <View style={stationInfoStyles.stationTimingContainer}>
                <ThemedText>
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
    const { theme } = useTheme();

    let stationTimingOffset = 0;
    const stationInfos: (React.JSX.Element | null)[] = [];
    for (let i = 0; i < busRouteInfos[route].stations.length; i++) {
        const thisStation = busRouteInfos[route].stations[i];
        const previousStation = i > 0 ? busRouteInfos[route].stations[i - 1] : null;
        const busStationTiming = busStationTimings[`${previousStation}>>${thisStation}`] ?? [];
        const busStationTimingAverage = busStationTiming.length > 0 ? MathExtra.average(...busStationTiming) : 0;
        stationTimingOffset += busStationTimingAverage;

        stationInfos.push(
            <StationInfo
                key={`${i}:${thisStation}`}
                type={
                    i === 0
                        ? StationInfoType.TOP
                        : i === busRouteInfos[route].stations.length - 1
                            ? StationInfoType.BOTTOM
                            : StationInfoType.MIDDLE
                }
                station={thisStation}
                stationTimingOffset={stationTimingOffset}
            />,
            busRouteInfos[route].inflexionIndices?.some(ii => Math.floor(ii) === i)
                ? <View
                    key={`${i}:inflexion`}
                    style={stationInfoStyles.inflexionMarkerContainer}
                >
                    <View style={[
                        stationInfoStyles.inflexionMarker,
                        { backgroundColor: theme.dimContrast },
                    ]} />
                </View>
                : null,
        );
    }
    return stationInfos;
}

type RouteInfoCardProps = {
    selectedRoute: BusRoute | null,
};
function RouteInfoCard({ selectedRoute }: RouteInfoCardProps) {
    const { theme } = useTheme();

    const routeColour = selectedRoute !== null
        ? busRouteInfos[selectedRoute].routeColour
        : 'transparent';
    const contrastColour = selectedRoute !== null
        ? (
            Colour.getLuminance(routeColour) > 150
                ? theme.black
                : theme.white
        )
        : theme.text;
    const fadedColour = Colour.mixRGBA(routeColour, contrastColour, 0.2);

    return (<View style={[
        styles.routeInfoCard,
        { backgroundColor: routeColour },
    ]}>
        <View style={[
            routeInfoStyles.routeInfoHeader,
            { backgroundColor: routeColour },
        ]}>
            {selectedRoute === null
                ? null
                : (<>
                    <View style={routeInfoStyles.routeInfoLeftSide}>
                        <View style={routeInfoStyles.routeNumberContainer}>
                            <ThemedText
                                type='title'
                                style={{
                                    textAlign: 'center',
                                    color: contrastColour,
                                }}
                            >
                                {selectedRoute}
                            </ThemedText>
                        </View>
                        <View style={routeInfoStyles.routeNameContainer}>
                            <ThemedText type='bold' style={{ color: Colour.mixRGBA(routeColour, contrastColour, 0.8) }}>
                                {busRouteInfos[selectedRoute].routeName}
                            </ThemedText>
                        </View>
                    </View>
                    <View style={routeInfoStyles.routeInfoRightSide}>
                        <View style={routeInfoStyles.routeInfoRightSideContent}>
                            <MaterialCommunityIcons
                                name='timetable'
                                size={24}
                                color={contrastColour}
                            />
                            <View style={routeInfoStyles.minuteMarksContainer}>
                                {(() => {
                                    const combinedRouteMinuteMarks: { minuteMark: number, route: BusRoute }[] = busRouteGroups.find(group => group.includes(selectedRoute))
                                        ?.flatMap(route => busRouteInfos[route].minuteMarks.map(minuteMark => ({ minuteMark, route })))
                                        .sort((a, b) => a.minuteMark - b.minuteMark)
                                        ?? (() => { throw new Error(`[routesScreens][RouteInfoCard] Route ${selectedRoute} not found in busRouteGroups`) })();
                                    return combinedRouteMinuteMarks
                                        .flatMap(({ minuteMark, route }) => ([
                                            <ThemedText type='bold' style={{ color: route === selectedRoute ? contrastColour : fadedColour }} key={`${route}:${minuteMark}`}>
                                                {`:${minuteMark.toString().padStart(2, '0')}`}
                                            </ThemedText>,
                                            <ThemedText type='bold' style={{ color: route === selectedRoute ? contrastColour : fadedColour }} key={`${route}:${minuteMark}:comma`}>
                                                {', '}
                                            </ThemedText>
                                        ]))
                                        .slice(0, -1);
                                })()}
                            </View>
                        </View>
                        <View style={routeInfoStyles.routeInfoRightSideContent}>
                            <MaterialCommunityIcons
                                name='weather-sunset'
                                size={24}
                                color={contrastColour}
                            />
                            <ThemedText type='bold' style={{ color: contrastColour }}>
                                {`${toTimeString(busRouteInfos[selectedRoute].firstService, true)} - ${toTimeString(busRouteInfos[selectedRoute].lastService, true)}`}
                            </ThemedText>
                        </View>
                        <View style={routeInfoStyles.routeInfoRightSideContent}>
                            <MaterialCommunityIcons
                                name='calendar-week'
                                size={24}
                                color={contrastColour}
                            />
                            <View style={routeInfoStyles.weekDaysContainer}>
                                {WEEK_DAYS.map((day, index) => {
                                    const isAvailable = busRouteInfos[selectedRoute].serviceDays.includes(index);
                                    return (
                                        <ThemedText
                                            key={index}
                                            type='bold'
                                            style={{
                                                color: isAvailable
                                                    ? contrastColour
                                                    : fadedColour,
                                            }}
                                        >
                                            {day[0]}
                                        </ThemedText>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </>)
            }
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
                {selectedRoute !== null
                    ? <StationInfos route={selectedRoute} />
                    : null
                }
            </ScrollView>
        </View>
    </View>);
}

export default function RoutesScreen() {
    const { theme } = useTheme();

    const [selectedRoute, setSelectedRoute] = useState<BusRoute>(BusRoute._1A);
    const controlButtons = [
        ...Object.entries(busRouteInfos)
            .sort(([keyA], [keyB]) => keyA > keyB ? 1 : -1)
            .map(([key, routeInfo]) => {
                const route = key as BusRoute;
                const routeColour = routeInfo.routeColour;
                const contrastColour = Colour.getLuminance(routeColour) > 150
                    ? theme.black
                    : theme.white;
                const backgroundColour = Colour.mixRGBA(
                    theme.background,
                    routeColour,
                    selectedRoute === route ? 1 : 0.25,
                );
                return (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.controlButton,
                            {
                                backgroundColor: backgroundColour,
                            },
                        ]}
                        onPress={() => { setSelectedRoute(route); }}
                    >
                        <ThemedText
                            type='boldPlus'
                            style={{
                                color: selectedRoute === route
                                    ? contrastColour
                                    : Colour.mixRGBA(
                                        backgroundColour,
                                        theme.highContrast,
                                        selectedRoute === route ? 1 : 0.4,
                                    ),
                            }}
                        >
                            {route}
                        </ThemedText>
                    </TouchableOpacity>
                );
            }),
        (<TouchableOpacity
            key={'canonRouteInfoButton'}
            style={[
                styles.controlButton,
                { backgroundColor: theme.dimContrast },
            ]}
            onPress={() => {
                const url = busRouteInfos[selectedRoute].canonInfoUrl;
                Linking.openURL(url);
            }}
        >
            <Octicons
                name='link-external'
                size={20}
                color={theme.highContrast}
            />
        </TouchableOpacity>),
    ];

    return (
        <FullscreenView>
            <View style={styles.screenContainer}>
                <RouteInfoCard selectedRoute={selectedRoute} />
                <View style={styles.controlsContainer}>
                    <View style={styles.legendContainer}>
                        <ThemedText type='faded'>
                            [ + ] stops at additional stations
                        </ThemedText>
                        <ThemedText type='faded'>
                            [ * ] weekend services
                        </ThemedText>
                    </View>
                    <View style={styles.controlsRowContainer}>
                        {controlButtons.slice(0, controlButtons.length / 2)}
                    </View>
                    <View style={styles.controlsRowContainer}>
                        {controlButtons.slice(controlButtons.length / 2)}
                    </View>
                </View>
            </View>
        </FullscreenView >
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
    controlsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    },
    legendContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlsRowContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    },
    controlButton: {
        flex: 1,
        aspectRatio: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
});

const ROUTE_INFO_HEADER_HEIGHT = 90;
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
    routeInfoLeftSide: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        paddingTop: 3,
    },
    routeNumberContainer: {
        minWidth: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    routeNameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 80,
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
    routeInfoRightSide: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    minuteMarksContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeInfoRightSideContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    weekDaysContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
    },
});

const DOT_DIAMETER = 14;
const stationInfoStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
    },
    routeLineContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: STATION_HEIGHT,
        width: DOT_DIAMETER,
        marginRight: 8,
    },
    line: {
        position: 'absolute',
        width: 4,
        height: STATION_HEIGHT * 2,
    },
    dot: {
        width: DOT_DIAMETER,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    inflexionMarkerContainer: {
        width: '90%',
        height: 0,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 1,
    },
    inflexionMarker: {
        width: DOT_DIAMETER,
        height: 2,
        borderRadius: 1,
    },
});