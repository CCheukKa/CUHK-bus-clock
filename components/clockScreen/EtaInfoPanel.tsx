import { EtaError, EtaInfo, isEtaError, isEtaInfoArray } from "@/utils/Bus";
import { Colour, getCountdown, toTimeString } from "@/utils/Helper";
import { busRouteInfos, stationAbbreviations } from "@/constants/BusData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { FontSizes } from "@/utils/Typography";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { SuboptimalRouteStyle } from "@/utils/Settings";
import { ThemedText } from "@/components/common/ThemedText";
import { useClockScreenContext } from "@/context/ClockScreenContext";

const noInfoTexts = [
    [
        'No buses in this universe... 🌌',
        'No buses in this timeline... ⏳',
        'No buses in this reality... 🌐',
        'No buses in this world... 🌍',
        'Oops! No buses... 🤷🏻',
        'WTF NO BUS?! OMG INSANE 🤯',
        'No buses found... 🚫',
        'Beep boop beep... 🤖',
        'Teehee! No buses... 🤭',
    ],
    [
        '🤔 Try something else..?',
        '🕒 Try again later..?',
        '🛸 Try somewhere else..?',
        '🦵🏻 Try walking..?',
        '🌀 Try teleporting..?',
        '🪽 Try flying..?',
        '🏊🏻 Try swimming..?',
        '⏪ Try rewinding time..?',
        '🤨 Complain to CUHK Transport Office..?',
        '🚦 Blame the traffic..?',
        '🌦️ Blame the weather..?',
        '🌌 Blame the universe..?',
        '😴 Just keep waiting..?',
        '🚌 Drive it yourself..?',
    ],
] as const;

type EtaInfoPanelProps = {
    time: Date;
    etaInfos: EtaInfo[] | EtaError;
};
export function EtaInfoPanel({ time, etaInfos }: EtaInfoPanelProps) {
    const { theme } = useTheme();
    const { settings, setSettings } = useSettings();

    const frameCount = useRef<number>(0);
    const frameTime = useRef<Date>(new Date());
    const frameEtaInfos = useRef<EtaInfo[] | EtaError>([]);

    const timeUpdated = time.getTime() !== frameTime.current.getTime();
    const etaInfosUpdated = JSON.stringify(etaInfos) !== JSON.stringify(frameEtaInfos.current);
    const etaInfosIsError = isEtaError(etaInfos);

    const shouldUpdate = (!etaInfosIsError && timeUpdated) || (etaInfosUpdated && !timeUpdated);
    if (shouldUpdate) { frameCount.current++; }

    frameTime.current = time;
    frameEtaInfos.current = etaInfos;

    const scrollSnapInterval = ETA_INFO_CARD_HEIGHT + ETA_INFO_CARD_GAP;
    const [sortedEtaInfos, setSortedEtaInfos] = useState<EtaInfo[] | null>(null);
    const { scrollTargetEtaInfo } = useClockScreenContext();
    useEffect(() => {
        if (scrollTargetEtaInfo === null) { return; }
        scrollToEtaInfo(scrollTargetEtaInfo);
    }, [scrollTargetEtaInfo]);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        setSortedEtaInfos(
            isEtaInfoArray(etaInfos)
                ? etaInfos.sort((a, b) => a.etaFromTime.getTime() - b.etaFromTime.getTime())
                : null
        );
    }, [frameCount.current]);

    return useMemo(() => (
        <View style={[
            panelStyles.panelContainer,
            {
                borderColor: theme.lowContrast,
            },
        ]}>
            <View style={[
                etaStyles.expandButton,
                { backgroundColor: theme.background },
            ]}>
                <TouchableOpacity
                    onPress={() => setSettings({ ...settings, showClockFace: !settings.showClockFace })}
                >
                    <MaterialCommunityIcons
                        name={settings.showClockFace ? "arrow-expand" : "arrow-collapse"}
                        size={24}
                        color={theme.halfContrast}
                    />
                </TouchableOpacity>
            </View>
            <View style={[
                panelStyles.panelContainerBackground,
                { backgroundColor: theme.minimalContrast },
            ]} />
            <View style={panelStyles.panelTitleContainer}>
                <ThemedText
                    type="subtitle"
                    style={[
                        panelStyles.panelTitle,
                        {
                            zIndex: 2,
                            color: theme.halfContrast,
                        },
                    ]}>
                    ETA Info Panel
                </ThemedText>
            </View>
            <View style={panelStyles.panelTitleContainer}>
                <ThemedText
                    type="subtitle"
                    style={[
                        panelStyles.panelTitle,
                        {
                            zIndex: 0,
                            color: 'red',
                            backgroundColor: theme.background,
                        },
                    ]}>
                    ETA Info Panel
                </ThemedText>
            </View>
            {sortedEtaInfos !== null
                ? <ScrollView
                    style={etaStyles.etaScrollContainer}
                    contentContainerStyle={etaStyles.etaScrollContainerContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={scrollSnapInterval}
                    snapToEnd={false}
                    ref={scrollViewRef}
                >
                    {sortedEtaInfos.map((etaInfo) => (
                        <EtaInfoCard
                            key={etaInfo.journey.route + etaInfo.etaFromTime}
                            time={time}
                            etaInfo={etaInfo}
                        />
                    ))}
                </ScrollView>
                : <View style={noInfoStyles.noInfoContainer}>
                    <ThemedText style={[
                        noInfoStyles.noInfoText,
                        { color: theme.lowContrast },
                    ]}>
                        {`${noInfoTexts[0][Math.floor(Math.random() * noInfoTexts[0].length)]}\n\n${noInfoTexts[1][Math.floor(Math.random() * noInfoTexts[1].length)]}`}
                    </ThemedText>
                </View>
            }
        </View>
    ), [sortedEtaInfos, settings]);
    /* -------------------------------------------------------------------------- */

    function scrollToEtaInfo(etaInfo: EtaInfo | null) {
        if (etaInfo === null) {
            console.warn(`[EtaInfoPanel] etaInfo is null`);
            return;
        }
        if (sortedEtaInfos === null) {
            console.warn(`[EtaInfoPanel] sortedEtaInfos is null, cannot scroll to ${JSON.stringify(etaInfo)}`);
            return;
        }
        const index = sortedEtaInfos.indexOf(etaInfo);
        if (index === -1) {
            console.warn(`[EtaInfoPanel] etaInfo ${JSON.stringify(etaInfo)} not found in sortedEtaInfos`);
            return;
        }
        scrollViewRef.current?.scrollTo({ y: scrollSnapInterval * index, animated: true });
    }
}

function EtaInfoCard({ time, etaInfo }: { time: Date, etaInfo: EtaInfo }) {
    const { theme } = useTheme();
    const { settings } = useSettings();
    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    const isPast = etaInfo.etaFromTime.getTime() < time.getTime();

    const cardColour = isPast ? theme.background : theme.dimContrast;
    const displayRouteColour = isPast ? Colour.mixRGBA(theme.dimContrast, routeColour, 0.5) : routeColour;

    const arrowDistance = 35;
    return (
        <View style={[
            etaStyles.etaInfoCard,
            {
                backgroundColor: cardColour,
            },
        ]}>
            <ThemedText style={[
                etaStyles.etaInfoCardStation,
                {
                    left: 0,
                    textAlign: 'left',
                    color: isPast ? theme.halfContrast : theme.highContrast,
                },
            ]}>
                {stationAbbreviations[etaInfo.journey.fromStation].replace(/ (?=\((?:Up|Down)\))/, '\n')}
            </ThemedText>
            <View style={etaStyles.etaInfoCardCenter}>
                <EtaTime time={time} etaTime={etaInfo.etaFromTime} isPast={isPast} right={arrowDistance} />
                <View style={etaStyles.arrowContainer}>
                    <View style={[
                        etaStyles.routeNumberBubble,
                        settings.suboptimalRouteStyle !== SuboptimalRouteStyle.FILLED && etaInfo.journey.isSuboptimal
                            ? {
                                borderColor: displayRouteColour,
                                borderWidth: 2,
                            }
                            : null,
                        {
                            backgroundColor:
                                settings.suboptimalRouteStyle !== SuboptimalRouteStyle.FILLED && etaInfo.journey.isSuboptimal
                                    ? cardColour
                                    : displayRouteColour,
                            shadowColor: contrastColour,
                            shadowRadius: 4,
                            elevation: 1,
                        },
                    ]}>
                        <ThemedText
                            type='boldPlus'
                            style={[
                                etaStyles.routeNumberBubbleText,
                                {
                                    color:
                                        settings.suboptimalRouteStyle !== SuboptimalRouteStyle.FILLED && etaInfo.journey.isSuboptimal
                                            ? theme.highContrast
                                            : contrastColour,
                                    opacity: isPast ? 0.8 : 1,
                                },
                            ]}
                        >
                            {etaInfo.journey.route}
                        </ThemedText>
                    </View>
                    <FontAwesome
                        name='long-arrow-right'
                        size={40}
                        color={displayRouteColour}
                        style={{
                            position: 'relative',
                            left: 12,
                            textShadowColor: contrastColour,
                            textShadowRadius: 4,
                        }}
                    />
                    <FontAwesome
                        name='long-arrow-right'
                        size={40}
                        color={displayRouteColour}
                        style={{
                            position: 'relative',
                            right: 8,
                            textShadowColor: contrastColour,
                            textShadowRadius: 4
                        }}
                    />
                </View>
                <EtaTime time={time} etaTime={etaInfo.etaToTime} isPast={isPast} left={arrowDistance} />
            </View>
            <ThemedText style={[
                etaStyles.etaInfoCardStation,
                {
                    right: 0,
                    textAlign: 'right',
                    color: isPast ? theme.halfContrast : theme.highContrast,
                },
            ]}>
                {stationAbbreviations[etaInfo.journey.toStation].replace(/ \(.*\)/, '')}
            </ThemedText>
        </View>
    );
}

function EtaTime({ time, etaTime, isPast, left, right }: { time: Date, etaTime: Date, isPast: boolean, left?: number, right?: number }) {
    const { theme } = useTheme();
    const { settings } = useSettings();

    const countdownString = toTimeString(getCountdown(time, etaTime));
    const etaString = etaTime.toLocaleTimeString('en-GB').slice(0, 5);
    return (
        <View style={[
            etaStyles.etaTimeContainer,
            { left, right },
        ]}>
            <ThemedText style={{ color: isPast ? theme.lowContrast : theme.highContrast }}>
                {settings.bigCountdownInPanel
                    ? countdownString
                    : etaString
                }
            </ThemedText>
            <ThemedText style={{
                color: isPast ? theme.lowContrast : theme.halfContrast,
                fontSize: FontSizes.tiny,
            }}>
                {settings.bigCountdownInPanel
                    ? `[ ${etaString} ]`
                    : `[ ${countdownString} ]`
                }
            </ThemedText>
        </View>
    );
}

const PANEL_CORNER_RADIUS = 10;
const panelStyles = StyleSheet.create({
    panelContainer: {
        width: '90%',
        flex: 1,
        borderWidth: 2,
        borderRadius: PANEL_CORNER_RADIUS,
        marginTop: 25,
        marginBottom: 15,
        borderColor: 'red',
        borderStyle: 'dashed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelContainerBackground: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1,
        borderRadius: PANEL_CORNER_RADIUS,
    },
    panelTitleContainer: {
        position: 'absolute',
        top: -14,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panelTitle: {
        paddingHorizontal: 6,
        paddingBottom: 2,
        borderRadius: 6,
    },
});

const noInfoStyles = StyleSheet.create({
    noInfoContainer: {
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noInfoText: {
        textAlign: 'center',
    },
});

const ETA_INFO_CARD_HEIGHT = 48;
const ETA_INFO_CARD_GAP = 10;
const etaStyles = StyleSheet.create({
    etaScrollContainer: {
        zIndex: 2,
        marginTop: 15,
        width: '95%',
        height: '100%',
        borderRadius: 6,
    },
    etaScrollContainerContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: ETA_INFO_CARD_GAP,
        paddingBottom: 60,
    },
    etaInfoCard: {
        width: '100%',
        height: ETA_INFO_CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        paddingVertical: 4,
    },
    etaInfoCardCenter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: -5,
    },
    routeNumberBubble: {
        position: 'absolute',
        zIndex: 1,
        height: '65%',
        aspectRatio: 1,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeNumberBubbleText: {
        textAlign: 'center',
    },
    etaTimeContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    etaInfoCardStation: {
        position: 'absolute',
        marginHorizontal: 8,
        width: '25%',
    },
    expandButton: {
        position: 'absolute',
        top: -20,
        right: -8,
        zIndex: 2,
        padding: 2,
        borderRadius: 4,
    },
});