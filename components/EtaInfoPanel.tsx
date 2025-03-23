import { EtaError, EtaInfo, isEtaInfoArray } from "@/backend/Bus";
import { Colour, getCountdown, toTimeString } from "@/backend/Helper";
import { busRouteInfos, stationAbbreviations } from "@/constants/BusData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
        '🦸🏻‍♂️ Try flying..?',
        '🏊🏻 Try swimming..?',
        '⏪ Try rewinding time..?',
        '🤨 Complain to CUHK Transport Office..?',
        '🚦 Blame the traffic..?',
        '🌦️ Blame the weather..?',
        '🌌 Blame the universe..?',
        '😴 Just wait..?',
        '🚌 Drive it yourself..?',
    ],
];

type EtaInfoPanelProps = {
    time: Date;
    etaInfos: EtaInfo[] | EtaError;
};
export function EtaInfoPanel({ time, etaInfos }: EtaInfoPanelProps) {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.panelContainer,
            {
                borderColor: theme.lowContrast,
            },
        ]}>
            <View style={[
                styles.panelContainerBackground,
                { backgroundColor: theme.minimalContrast },
            ]} />
            <Text style={[
                styles.panelTitle,
                {
                    zIndex: 2,
                    color: theme.halfContrast,
                },
            ]}>ETA Info Panel</Text>
            <Text style={[
                styles.panelTitle,
                {
                    zIndex: 0,
                    color: 'transparent',
                    backgroundColor: theme.background,
                },
            ]}>ETA Info Panel</Text>
            {
                isEtaInfoArray(etaInfos)
                    ? <ScrollView
                        style={styles.etaScrollContainer}
                        contentContainerStyle={styles.etaScrollContainerContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            etaInfos
                                .sort((a, b) => a.etaFromTime.getTime() - b.etaFromTime.getTime())
                                .map((etaInfo) => (
                                    <EtaInfoCard
                                        key={etaInfo.journey.route + etaInfo.etaFromTime}
                                        time={time}
                                        etaInfo={etaInfo}
                                    />
                                ))
                        }
                    </ScrollView>
                    : <View style={styles.noInfoContainer}>
                        <Text style={[
                            styles.noInfoText,
                            { color: theme.lowContrast },
                        ]}>
                            {`${noInfoTexts[0][Math.floor(Math.random() * noInfoTexts[0].length)]}\n\n${noInfoTexts[1][Math.floor(Math.random() * noInfoTexts[1].length)]}`}
                        </Text>
                    </View>
            }
        </View>
    );
}

function EtaInfoCard({ time, etaInfo }: { time: Date, etaInfo: EtaInfo }) {
    const { theme } = useTheme();
    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    const isPast = etaInfo.etaFromTime.getTime() < time.getTime();

    const arrowDistance = 35;
    return (
        <View style={[
            styles.etaInfoCard,
            {
                backgroundColor: isPast ? theme.background : theme.dimContrast,
            },
        ]}>
            <Text style={[
                styles.etaInfoCardStation,
                {
                    left: 0,
                    textAlign: 'left',
                    color: isPast ? theme.halfContrast : theme.highContrast,
                },
            ]}>
                {stationAbbreviations[etaInfo.journey.fromStation]}
            </Text>
            <View style={styles.etaInfoCardCenter}>
                <EtaTime time={time} etaTime={etaInfo.etaFromTime} isPast={isPast} right={arrowDistance} />
                <View style={styles.arrowContainer}>
                    <View style={[
                        styles.routeNumberBubble,
                        {
                            backgroundColor: isPast ? Colour.mixRGBA(theme.dimContrast, routeColour, 0.5) : routeColour,
                            shadowColor: contrastColour,
                            shadowRadius: 4,
                            elevation: 1,
                        },
                    ]}>
                        <Text style={[
                            styles.routeNumberBubbleText,
                            {
                                color: contrastColour,
                                opacity: isPast ? 0.8 : 1,
                            },
                        ]}>{etaInfo.journey.route}</Text>
                    </View>
                    <FontAwesome
                        name='long-arrow-right'
                        size={40}
                        color={isPast ? Colour.mixRGBA(theme.dimContrast, routeColour, 0.5) : routeColour}
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
                        color={isPast ? Colour.mixRGBA(theme.dimContrast, routeColour, 0.5) : routeColour}
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
            <Text style={[
                styles.etaInfoCardStation,
                {
                    right: 0,
                    textAlign: 'right',
                    color: isPast ? theme.halfContrast : theme.highContrast,
                },
            ]}>
                {stationAbbreviations[etaInfo.journey.toStation].replace(/ \(.*\)/, '')}
            </Text>
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
            styles.etaTimeContainer,
            { left, right },
        ]}>
            <Text style={{
                color: isPast ? theme.lowContrast : theme.highContrast,
                fontWeight: 'bold',
                fontSize: 18,
            }}>
                {settings.bigCountdownInPanel
                    ? countdownString
                    : etaString
                }
            </Text>
            <Text style={{
                color: isPast ? theme.lowContrast : theme.halfContrast,
                fontWeight: 'bold',
                fontSize: 12,
            }}>
                {settings.bigCountdownInPanel
                    ? `[ ${etaString} ]`
                    : `[ ${countdownString} ]`
                }
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    panelContainer: {
        width: '90%',
        flex: 1,
        borderWidth: 2,
        borderRadius: 10,
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
    },
    panelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: -15,
        paddingHorizontal: 6,
        paddingBottom: 2,
        borderRadius: 6,
    },
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
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
        gap: 10,
        paddingBottom: 60,
    },
    etaInfoCard: {
        width: '100%',
        height: 48,
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
        fontWeight: 'bold',
        fontSize: 16,
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
        fontSize: 16,
        marginHorizontal: 8,
        width: '25%',
    },
});