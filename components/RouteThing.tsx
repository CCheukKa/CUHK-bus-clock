import { ViewProps } from "react-native";
import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { useThemeColour } from "@/hooks/useThemeColour";
import { FromTo, getETAs } from "@/api/Bus";
import { BusRoute, busRouteInfos, Region, Station } from "@/constants/BusData";
import { Colour, MathExtra } from "@/api/Helper";

export type RouteThingProps = {
    route: BusRoute;
    currentTime: Date;
    etaTime: Date;
} & ViewProps;

export function RouteThing({ route, currentTime, etaTime, ...otherProps }: RouteThingProps) {
    const routeColour = busRouteInfos[route].routeColour;
    const angle = etaTime.getMinutes() * 6 + etaTime.getSeconds() / 10;
    const eta = etaTime.getTime() - currentTime.getTime();
    const etaMinutes = Math.floor(Math.abs(eta) / 60000);
    const etaSeconds = Math.floor(Math.abs(eta) % 60000 / 1000);
    const opacity = eta > 0 ? 1 : 0.6;
    const contrastColour = Colour.getBrightness(routeColour) > 150 ? '#000000' : '#ffffff';
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
                    backgroundColour: routeColour,
                    opacity,
                    height: routeAnnotationLineLength
                }}
            />
            <ClockThing
                degrees={angle} distance={1.2}
                type={ClockThingType.ROUTE_NUMBER_BUBBLE}
                style={{
                    backgroundColour: Colour.mixRGBA(useThemeColour({}, 'background'), routeColour, opacity),
                    textColour: contrastColour,
                    scale: routeBubbleScale,
                }}
            >
                {route}
            </ClockThing>
            <ClockThing
                degrees={angle} distance={routeEtaCountdownDistance}
                type={ClockThingType.ROUTE_ETA_COUNTDOWN}
                style={{ textColour: routeColour, opacity }}
            >
                {eta < 0 ? '-' : null}{etaMinutes}:{etaSeconds.toString().padStart(2, '0')}
            </ClockThing>
        </>
    );
}

export function getRouteThings(currentTime: Date, fromTo: FromTo) {
    const etas = getETAs(fromTo, currentTime, 10, 30);
    if (etas.length === 0) {
        // TODO: add a "no buses" message
        return null;
    }
    return etas.map(etaInfo => (
        <RouteThing
            route={etaInfo.route}
            currentTime={currentTime}
            etaTime={etaInfo.etaTime}
            key={`${etaInfo.route}-${etaInfo.etaTime.getTime()}`}
        />
    ));
}