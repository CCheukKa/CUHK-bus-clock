import { ViewProps } from "react-native";
import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { useThemeColour } from "@/hooks/useThemeColour";
import { getETAs } from "@/api/Bus";
import { BusRoute, busRouteInfos, Region, Station } from "@/constants/BusData";
import { Colour } from "@/api/Helper";

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
                style={{
                    backgroundColour: Colour.mixRGBA(useThemeColour({}, 'background'), routeColour, opacity),
                }}
            >
                {route}
            </ClockThing>
            <ClockThing
                degrees={angle} length={1.5}
                type={ClockThingType.ROUTE_ETA_COUNTDOWN}
                style={{ textColour: routeColour, opacity }}
            >
                {eta < 0 ? '-' : null}{etaMinutes}:{etaSeconds.toString().padStart(2, '0')}
            </ClockThing>
        </>
    );
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