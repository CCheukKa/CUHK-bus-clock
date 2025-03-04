import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { EtaInfo } from "@/backend/Bus";
import { busRouteInfos } from "@/constants/BusData";
import { Colour, MathExtra } from "@/backend/Helper";
import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text } from "react-native";

type RouteThingProps = {
    etaInfo: EtaInfo;
    currentTime: Date;
};

export function RouteThing({ etaInfo, currentTime }: RouteThingProps) {
    const { theme } = useTheme();

    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const etaTime = etaInfo.etaTime;
    const angle = etaTime.getMinutes() * 6 + etaTime.getSeconds() / 10;
    const eta = etaTime.getTime() - currentTime.getTime();
    const etaMinutes = Math.floor(Math.abs(eta) / 60000);
    const etaSeconds = Math.floor(Math.abs(eta) % 60000 / 1000);
    const opacity = eta > 0 ? 1 : 0.75;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    const routeBubbleScale = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: 0.6 },
        { pin: 0, value: 1 },
        { pin: 15, value: 0.6 },
    ]);
    const routeAnnotationLineLength = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: 75 },
        { pin: 0, value: 160 },
        { pin: 15, value: 75 },
    ]);
    const routeBubbleDistance = 1.3;
    const routeEtaCountdownDistance = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: routeBubbleDistance + 0.32 },
        { pin: 0, value: routeBubbleDistance + 0.38 },
        { pin: 15, value: routeBubbleDistance + 0.32 },
    ]);

    return (
        <>
            <ClockThing
                degrees={angle} distance={routeBubbleDistance}
                type={ClockThingType.ROUTE_ANNOTATION_LINE}
                style={{
                    backgroundColour: Colour.mixRGBA(theme.background, routeColour, opacity),
                    height: routeAnnotationLineLength,
                }}
            />
            <ClockThing
                degrees={angle} distance={routeBubbleDistance}
                type={ClockThingType.ROUTE_NUMBER_BUBBLE}
                style={{
                    backgroundColour: Colour.mixRGBA(theme.background, routeColour, opacity),
                    textColour: contrastColour,
                    scale: routeBubbleScale,
                }}
            >
                {etaInfo.journey.route}
            </ClockThing>
            <ClockThing
                degrees={angle} distance={routeEtaCountdownDistance}
                type={ClockThingType.ROUTE_ETA_COUNTDOWN}
                style={{ textColour: Colour.mixRGBA(theme.background, routeColour, opacity) }}
            >
                {eta < 0 ? '-' : null}{etaMinutes}:{etaSeconds.toString().padStart(2, '0')}
            </ClockThing>
        </>
    );
}

type RouteThingsProps = {
    etaInfos: EtaInfo[];
    currentTime: Date;
};
export function RouteThings({ etaInfos, currentTime }: RouteThingsProps) {
    if (etaInfos.length === 0) {
        return (
            <ClockThing
                degrees={180} distance={1.4}
                type={ClockThingType.ERROR_TEXT}
            >
                No route available between these locations
            </ClockThing>
        );
    }
    return etaInfos.map(etaInfo => (
        <RouteThing
            etaInfo={etaInfo}
            currentTime={currentTime}
            key={`${etaInfo.journey.route}-${etaInfo.etaTime.getTime()}`}
        />
    ));
}