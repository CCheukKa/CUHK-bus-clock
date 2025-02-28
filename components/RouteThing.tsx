import { ViewProps } from "react-native";
import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { useThemeColour } from "@/hooks/useThemeColour";
import { getETAs } from "@/api/Bus";
import { BusRoute, busRouteInfos, Region, Station } from "@/constants/BusData";

export type RouteThingProps = {
    route: BusRoute;
    currentTime: Date;
    etaTime: Date;
} & ViewProps;

export function RouteThing({ route, currentTime, etaTime, ...otherProps }: RouteThingProps) {
    const routeColour = busRouteInfos[route].colour;
    const angle = etaTime.getMinutes() * 6 + etaTime.getSeconds() / 10;
    const eta = etaTime.getTime() - currentTime.getTime();
    const etaMinutes = Math.floor(eta / 60000);
    const etaSeconds = Math.abs(Math.floor((eta % 60000) / 1000));
    const opacity = eta > 0 ? 1 : 0.6;

    return (
        <>
            <ClockThing
                degrees={angle} length={1.2}
                type={ClockThingType.ROUTE_ANNOTATION_LINE}
                style={{ backgroundColour: routeColour, opacity }}
            />
            <ClockThing
                degrees={angle} length={1.2}
                type={ClockThingType.ROUTE_NUMBER_BUBBLE}
                style={{ backgroundColour: mixRGBA(useThemeColour({}, 'background'), routeColour, opacity) }}
            >
                {route}
            </ClockThing>
            <ClockThing
                degrees={angle} length={1.5}
                type={ClockThingType.ROUTE_ETA_COUNTDOWN}
                style={{ textColour: routeColour, opacity }}
            >
                {etaMinutes}:{etaSeconds.toString().padStart(2, '0')}
            </ClockThing>
        </>
    );
}

function mixRGBA(colour1: string, colour2: string, ratio: number) {
    const r1 = parseInt(colour1.slice(1, 3), 16);
    const g1 = parseInt(colour1.slice(3, 5), 16);
    const b1 = parseInt(colour1.slice(5, 7), 16);
    const r2 = parseInt(colour2.slice(1, 3), 16);
    const g2 = parseInt(colour2.slice(3, 5), 16);
    const b2 = parseInt(colour2.slice(5, 7), 16);
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getRouteThings(currentTime: Date) {
    const etas = getETAs({ from: Region.MAIN_CAMPUS, to: Region.CWC_COLLEGE }, currentTime, 10, 30);
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