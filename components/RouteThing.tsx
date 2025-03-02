import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { EtaInfo } from "@/backend/Bus";
import { busRouteInfos } from "@/constants/BusData";
import { Colour, MathExtra } from "@/backend/Helper";
import { ThemeColours } from "@/constants/ThemeColours";

type RouteThingProps = {
    etaInfo: EtaInfo;
    currentTime: Date;
};

export function RouteThing({ etaInfo, currentTime }: RouteThingProps) {
    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const etaTime = etaInfo.etaTime;
    const angle = etaTime.getMinutes() * 6 + etaTime.getSeconds() / 10;
    const eta = etaTime.getTime() - currentTime.getTime();
    const etaMinutes = Math.floor(Math.abs(eta) / 60000);
    const etaSeconds = Math.floor(Math.abs(eta) % 60000 / 1000);
    const opacity = eta > 0 ? 1 : 0.75;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? ThemeColours.black : ThemeColours.white;
    const routeBubbleScale = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: 0.6 },
        { pin: 0, value: 1 },
        { pin: 15, value: 0.6 },
    ]);
    const routeAnnotationLineLength = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: 28 * 0.6 },
        { pin: 0, value: 28 },
        { pin: 15, value: 28 * 0.6 },
    ]);
    const routeEtaCountdownDistance = MathExtra.interpolateBetweenPins(eta / 60000, [
        { pin: -5, value: 1.46 },
        { pin: 0, value: 1.5 },
        { pin: 15, value: 1.46 },
    ]);

    return (
        <>
            <ClockThing
                degrees={angle} distance={1.2}
                type={ClockThingType.ROUTE_ANNOTATION_LINE}
                style={{
                    backgroundColour: Colour.mixRGBA(ThemeColours.background, routeColour, opacity),
                    height: routeAnnotationLineLength,
                }}
            />
            <ClockThing
                degrees={angle} distance={1.2}
                type={ClockThingType.ROUTE_NUMBER_BUBBLE}
                style={{
                    backgroundColour: Colour.mixRGBA(ThemeColours.background, routeColour, opacity),
                    textColour: contrastColour,
                    scale: routeBubbleScale,
                }}
            >
                {etaInfo.journey.route}
            </ClockThing>
            <ClockThing
                degrees={angle} distance={routeEtaCountdownDistance}
                type={ClockThingType.ROUTE_ETA_COUNTDOWN}
                style={{ textColour: Colour.mixRGBA(ThemeColours.background, routeColour, opacity) }}
            >
                {eta < 0 ? '-' : null}{etaMinutes}:{etaSeconds.toString().padStart(2, '0')}
            </ClockThing>
        </>
    );
}

export function getRouteThings(etaInfos: EtaInfo[], currentTime: Date) {
    if (etaInfos.length === 0) {
        // TODO: add a "no buses" message
        return null;
    }
    return etaInfos.map(etaInfo => (
        <RouteThing
            etaInfo={etaInfo}
            currentTime={currentTime}
            key={`${etaInfo.journey.route}-${etaInfo.etaTime.getTime()}`}
        />
    ));
}