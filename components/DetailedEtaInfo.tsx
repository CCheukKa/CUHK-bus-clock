import { EtaError, EtaInfo, isEtaInfoArray } from "@/backend/Bus";
import { Colour, getEta, toTimeString } from "@/backend/Helper";
import { busRouteInfos } from "@/constants/BusData";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type DetailedEtaInfoProps = {
    time: Date;
    etaInfos: EtaInfo[] | EtaError;
};
export function DetailedEtaInfo({ time, etaInfos }: DetailedEtaInfoProps) {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.infoContainer,
            {
                borderColor: theme.lowContrast,
            },
        ]}>
            <View style={[
                styles.infoContainerBackground,
                { backgroundColor: theme.minimalContrast },
            ]} />
            <Text style={[
                styles.infoTitle,
                {
                    zIndex: 2,
                    color: theme.halfContrast,
                },
            ]}>ETA Info</Text>
            <Text style={[
                styles.infoTitle,
                {
                    zIndex: 0,
                    color: 'transparent',
                    backgroundColor: theme.background,
                },
            ]}>ETA Info</Text>
            <ScrollView
                style={[
                    styles.etaScrollContainer,
                    { zIndex: 2 },
                ]}
                contentContainerStyle={styles.etaScrollContainerContent}
            >
                {
                    isEtaInfoArray(etaInfos)
                        ? etaInfos.map((etaInfo) => (
                            <EtaInfoCard
                                key={Math.random()}
                                time={time}
                                etaInfo={etaInfo}
                            />
                        ))
                        : null
                }
            </ScrollView>
        </View>
    );
}

function EtaInfoCard({ time, etaInfo }: { time: Date, etaInfo: EtaInfo }) {
    const { theme } = useTheme();
    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    return (
        <View style={[
            styles.etaInfoCard,
            {
                backgroundColor: theme.dimContrast,
            },
        ]}>
            <View style={styles.etaInfoCardCenter}>
                <EtaTime time={time} etaTime={etaInfo.etaFromTime} />
                <View style={styles.arrowContainer}>
                    <View style={[
                        styles.routeNumberBubble,
                        {
                            backgroundColor: routeColour,
                            shadowColor: contrastColour,
                            shadowRadius: 4,
                            elevation: 1,
                        },
                    ]}>
                        <Text style={[
                            styles.routeNumberBubbleText,
                            { color: contrastColour },
                        ]}>{etaInfo.journey.route}</Text>
                    </View>
                    <FontAwesome
                        name='long-arrow-right'
                        size={40}
                        color={routeColour}
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
                        color={routeColour}
                        style={{
                            position: 'relative',
                            right: 6,
                            textShadowColor: contrastColour,
                            textShadowRadius: 4
                        }}
                    />
                </View>
                <EtaTime time={time} etaTime={etaInfo.etaToTime} />
            </View>
        </View>
    );
}

function EtaTime({ time, etaTime }: { time: Date, etaTime: Date }) {
    const { theme } = useTheme();
    const { etaMinutes, etaSeconds } = getEta(time, etaTime);
    return (
        <View style={styles.etaTimeContainer}>
            <Text style={{
                color: theme.highContrast,
                fontWeight: 'bold',
                fontSize: 18,
            }}>
                {etaTime.toLocaleTimeString('en-GB').slice(0, 5)}
            </Text>
            <Text style={{
                color: theme.halfContrast,
                fontWeight: 'bold',
                fontSize: 12,
            }}>
                {`(${toTimeString([etaMinutes, etaSeconds])})`}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    infoContainer: {
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
    infoContainerBackground: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: -15,
        paddingHorizontal: 6,
        paddingBottom: 2,
        borderRadius: 6,
    },
    etaScrollContainer: {
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});