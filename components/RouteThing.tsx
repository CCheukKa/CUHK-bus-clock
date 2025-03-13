import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { EtaError, EtaErrorType, EtaInfo, isEtaError, NoServiceTodayError, OutOfServiceHoursError } from "@/backend/Bus";
import { busRouteInfos } from "@/constants/BusData";
import { Colour, getCountdown, MathExtra, toTimeString } from "@/backend/Helper";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type RouteThingInfo = {
    etaInfo: EtaInfo;
    angle: number;
    routeBubbleOrbit: number;
    remainingSeconds: number;
    routeBubbleScale: number;
    routeAnnotationLineLength: number;
    routeBubbleDistance: number;
    routeEtaCountdownDistance: number;
};
const MAXIMUM_ORBIT_COUNT = 3;
function computeRouteThingInfos(etaInfos: EtaInfo[], currentTime: Date): RouteThingInfo[] {
    const routeBubbleOrbits: number[][] = Array.from({ length: MAXIMUM_ORBIT_COUNT }, () => []);

    return etaInfos
        .map(etaInfo => computeRouteThingInfo(etaInfo, currentTime))
        .filter(info => info !== null);
    /* -------------------------------------------------------------------------- */
    function computeRouteThingInfo(etaInfo: EtaInfo, currentTime: Date): RouteThingInfo | null {
        const remainingSeconds = getCountdown(currentTime, etaInfo.etaFromTime);
        const totalMinutes = remainingSeconds / 60;

        const TOLERABLE_ANGULAR_DISTANCE = MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 10 },
            { pin: 0, value: 15 },
            { pin: 15, value: 10 },
        ]);

        const angle = etaInfo.etaFromTime.getMinutes() * 6 + etaInfo.etaFromTime.getSeconds() / 10;
        let routeBubbleOrbit: number | null = null;
        let placed = false;
        for (let i = 0; i < MAXIMUM_ORBIT_COUNT; i++) {
            const orbitAngles = routeBubbleOrbits[i];
            if (orbitAngles.every(existingAngle => getAngularDistance(existingAngle, angle) >= TOLERABLE_ANGULAR_DISTANCE)) {
                orbitAngles.push(angle);
                placed = true;
                routeBubbleOrbit = i;
                break;
            }
        }
        if (!placed || routeBubbleOrbit === null) {
            console.warn(`RouteThing not placed, route ${etaInfo.journey.route}, ${angle}deg`);
            return null;
        }

        const routeBubbleScale = MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 0.6 },
            { pin: 0, value: 1 },
            { pin: 15, value: 0.6 },
        ]);
        const routeAnnotationLineLength = MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 60 },
            { pin: 0, value: 150 },
            { pin: 15, value: 60 },
        ]) + routeBubbleOrbit * MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 100 },
            { pin: 0, value: 180 },
            { pin: 15, value: 100 },
        ]);
        const routeBubbleDistance = MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 1.2 },
            { pin: 0, value: 1.3 },
            { pin: 15, value: 1.2 },
        ]) + routeBubbleOrbit * MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: 0.2 },
            { pin: 0, value: 0.36 },
            { pin: 15, value: 0.2 },
        ]);
        const routeEtaCountdownDistance = MathExtra.interpolateBetweenPins(totalMinutes, [
            { pin: -5, value: routeBubbleDistance + 0.32 },
            { pin: 0, value: routeBubbleDistance + 0.38 },
            { pin: 15, value: routeBubbleDistance + 0.32 },
        ]);

        return {
            etaInfo,
            angle,
            routeBubbleOrbit,
            remainingSeconds,
            routeBubbleScale,
            routeAnnotationLineLength,
            routeBubbleDistance,
            routeEtaCountdownDistance,
        };
    }
}

export function RouteThing({ routeThingInfo }: { routeThingInfo: RouteThingInfo }) {
    const {
        etaInfo,
        angle,
        remainingSeconds,
        routeBubbleScale,
        routeAnnotationLineLength,
        routeBubbleDistance,
        routeEtaCountdownDistance
    } = routeThingInfo;
    // 
    const { theme } = useTheme();
    const { settings } = useSettings();

    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const opacity = remainingSeconds > 0 ? 1 : 0.75;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;

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
                {settings.showCountdown
                    ? toTimeString(remainingSeconds)
                    : etaInfo.etaFromTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                }
            </ClockThing>
        </>
    );
}

type RouteThingsProps = {
    etaInfos: EtaInfo[] | EtaError;
    currentTime: Date;
};
export function RouteThings({ etaInfos, currentTime }: RouteThingsProps) {
    return useMemo(() => {
        if (isEtaError(etaInfos)) { return handleErrors(etaInfos); }

        const routeThingInfos: RouteThingInfo[] = [];
        const rawRouteThingInfos = computeRouteThingInfos(etaInfos.sort((a, b) => a.etaFromTime.getTime() - b.etaFromTime.getTime()), currentTime);
        for (let i = MAXIMUM_ORBIT_COUNT - 1; i >= 0; i--) {
            routeThingInfos.push(...rawRouteThingInfos.filter(info => info.routeBubbleOrbit === i));
        }

        return routeThingInfos.map(routeThingInfo => (
            <RouteThing
                routeThingInfo={routeThingInfo}
                key={`${routeThingInfo.etaInfo.journey.route}-${routeThingInfo.etaInfo.etaFromTime.getTime()}`}
            />
        ));
    }, [etaInfos]);
}

function handleErrors(etaError: EtaError) {
    const errorMessage: string = (() => {
        switch (true) {
            case etaError.isType(EtaErrorType.INTERNAL_API_ERROR):
                return 'Internal API error';
            case etaError.isType(EtaErrorType.NO_ROUTE_FOUND):
                return 'No route found between these locations';
            case etaError.isType(EtaErrorType.OUT_OF_SERVICE_HOURS):
                {
                    let msg = 'Out of service hours';
                    for (const route of (etaError as OutOfServiceHoursError).routes) {
                        msg += `\nRoute ${route.replaceAll('_', '')} - ${toTimeString(busRouteInfos[route].firstService, true)}-${toTimeString(busRouteInfos[route].lastService, true)}`;
                    }
                    return msg;
                }
            case etaError.isType(EtaErrorType.NO_SERVICE_TODAY):
                {
                    let msg = 'No service between these locations today';
                    for (const route of (etaError as NoServiceTodayError).routes) {
                        msg += `\nRoute ${route.replaceAll('_', '')} - ${busRouteInfos[route].days.map(day => weekDays[day]).join(', ')} only`;
                    }
                    return msg;
                }
            case etaError.isType(EtaErrorType.NO_SERVICE_WITHIN_PEEK_TIME):
                return 'No service within peek time\nTry increasing peek time in settings';
            default:
                return 'Unknown error';
        }
    })();
    return (
        <ClockThing
            degrees={180} distance={1.2}
            type={ClockThingType.ERROR_TEXT}
        >
            {errorMessage}
        </ClockThing>
    );
}

function getAngularDistance(a: number, b: number) {
    const diff = Math.abs(a - b);
    return diff > 180 ? 360 - diff : diff;
}