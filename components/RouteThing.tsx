import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { EtaError, EtaErrorType, EtaInfo, isEtaError, NoServiceTodayError, OutOfServiceHoursError } from "@/backend/Bus";
import { busRouteInfos } from "@/constants/BusData";
import { Colour, getCountdown, MathExtra, toTimeString } from "@/backend/Helper";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type RouteBubbleInfo = {
    bubbleScale: number;
    bubbleAngle: number;
    bubbleDistance: number;
    bubbleOrbit: number;
    bubbleAlpha: number;
};
type RouteAnnotationLineInfo = {
    annotationLineLength: number;
};
type RouteTimingInfo = {
    timingX: number;
    timingY: number;
};
type RouteThingBasicInfo = {
    etaInfo: EtaInfo;
    remainingSeconds: number;
};
type RouteThingInfo = RouteThingBasicInfo & RouteBubbleInfo & RouteAnnotationLineInfo & RouteTimingInfo;
type RouteThingPreInfo = RouteThingBasicInfo & RouteBubbleInfo & RouteAnnotationLineInfo;
const MAX_ORBIT_COUNT = 3;
function computeRouteThingInfos(etaInfos: EtaInfo[], currentTime: Date, timingHideMinutes: number): RouteThingInfo[] {
    const routeThingPreInfos: RouteThingPreInfo[] = [];
    const bubbleOrbits: number[][] = Array.from({ length: MAX_ORBIT_COUNT }, () => []);
    for (let i = 0; i < etaInfos.length; i++) {
        const etaInfo = etaInfos[i];
        const remainingMinutes = getCountdown(currentTime, etaInfo.etaFromTime) / 60;
        const routeBubbleInfo = computeRouteBubbleInfo(etaInfo, remainingMinutes);
        if (routeBubbleInfo === null) { continue; }
        const routeAnnotationLineInfo = computeRouteAnnotationLineInfo(routeBubbleInfo.bubbleOrbit, remainingMinutes);
        routeThingPreInfos.push({
            etaInfo,
            remainingSeconds: getCountdown(currentTime, etaInfo.etaFromTime),
            ...routeBubbleInfo,
            ...routeAnnotationLineInfo,
        });
    }

    const routeThingInfos: RouteThingInfo[] = [];
    const routeTimingPositions: { x: number, y: number }[] = [];
    const currentMinuteAngle = currentTime.getMinutes() * 6 + currentTime.getSeconds() / 10;
    routeThingPreInfos.sort((a, b) =>
        MathExtra.getAngularDistance(a.bubbleAngle, currentMinuteAngle)
        - MathExtra.getAngularDistance(b.bubbleAngle, currentMinuteAngle)
    );
    for (const routeThingPreInfo of routeThingPreInfos) {
        const routeTimingInfo =
            Math.abs(routeThingPreInfo.remainingSeconds) <= timingHideMinutes * 60
                ? computeRouteTimingInfo(routeThingPreInfos, routeThingPreInfo)
                : { timingX: 0, timingY: 0 };
        routeTimingPositions.push({ x: routeTimingInfo.timingX, y: routeTimingInfo.timingY });
        routeThingInfos.push({
            ...routeThingPreInfo,
            ...routeTimingInfo,
        });
    }

    return routeThingInfos;
    /* -------------------------------------------------------------------------- */
    function computeRouteBubbleInfo(etaInfo: EtaInfo, remainingMinutes: number): RouteBubbleInfo | null {
        const TOLERABLE_ANGULAR_DISTANCE = MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 10 },
            { pin: 0, value: 15 },
            { pin: 15, value: 10 },
        ]);

        const bubbleAngle = etaInfo.etaFromTime.getMinutes() * 6 + etaInfo.etaFromTime.getSeconds() / 10;
        let bubbleOrbit: number | null = null;
        let placed = false;
        for (let i = 0; i < MAX_ORBIT_COUNT; i++) {
            const orbitAngles = bubbleOrbits[i];
            if (orbitAngles.every(existingAngle => MathExtra.getAngularDistance(existingAngle, bubbleAngle) >= TOLERABLE_ANGULAR_DISTANCE)) {
                orbitAngles.push(bubbleAngle);
                placed = true;
                bubbleOrbit = i;
                break;
            }
        }
        if (!placed || bubbleOrbit === null) {
            console.warn(`[RouteThing][computeRouteBubbleInfo] RouteBubble not placed, route ${etaInfo.journey.route}, ${bubbleAngle}deg`);
            return null;
        }

        const bubbleScale = MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 0.6 },
            { pin: 0, value: 1 },
            { pin: 15, value: 0.6 },
        ]);
        const bubbleDistance = MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 1.2 },
            { pin: 0, value: 1.3 },
            { pin: 15, value: 1.2 },
        ]) + bubbleOrbit * MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 0.24 },
            { pin: 0, value: 0.36 },
            { pin: 15, value: 0.24 },
        ]);
        const bubbleAlpha = MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -10, value: 0.2 },
            { pin: 0, value: 1 },
            { pin: 15, value: 0.2 },
        ]);

        return {
            bubbleScale,
            bubbleAngle,
            bubbleDistance,
            bubbleOrbit,
            bubbleAlpha,
        };
    }
    function computeRouteAnnotationLineInfo(bubbleOrbit: number, remainingMinutes: number): RouteAnnotationLineInfo {
        const annotationLineLength = MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 60 },
            { pin: 0, value: 150 },
            { pin: 15, value: 60 },
        ]) + bubbleOrbit * MathExtra.interpolateBetweenPins(remainingMinutes, [
            { pin: -5, value: 118 },
            { pin: 0, value: 180 },
            { pin: 15, value: 118 },
        ]);
        return { annotationLineLength };
    }
    function computeRouteTimingInfo(routeThingPreInfos: RouteThingPreInfo[], routeThingPreInfo: RouteThingPreInfo): RouteTimingInfo {
        const clockFaceRadius = 1;
        //TODO: find a way to calculate this exactly
        const bubbleRadius = routeThingPreInfo.bubbleScale * 0.1;
        //TODO: find a way to calculate this exactly based on rendered size
        const timingHalfWidth = 0.32;
        //TODO: find a way to calculate this exactly based on rendered size
        const timingHalfHeight = 0.15;
        const { x: bubbleX, y: bubbleY } = MathExtra.clockPolarToXY(routeThingPreInfo.bubbleAngle, routeThingPreInfo.bubbleDistance);

        const isUpperHalf = bubbleY >= 0;
        const isRightHalf = bubbleX >= 0;
        const timingRelativeAngleOffsets = [0, -10, 10, -20, 20, -30, 30, -40, 40, -45, 45];
        const timingRelativeAngle = timingRelativeAngleOffsets.map(angleOffset => [
            isRightHalf
                ? [angleOffset + 90, angleOffset + 270]
                : [angleOffset + 270, angleOffset + 90],
            isUpperHalf
                ? [angleOffset + 0, angleOffset + 180]
                : [angleOffset + 180, angleOffset + 0],
            angleOffset + routeThingPreInfo.bubbleAngle,
        ]).flat(2);
        const timingDistances = [0, 0.05, 0.1, 0.15];

        //TODO: Implement recursive backtracking on failure
        for (let distance of timingDistances) {
            for (let clockAngle of timingRelativeAngle) {
                const buffer = 0;

                const offset = getTimingOffset(
                    (-clockAngle + 90) * Math.PI / 180,
                    bubbleRadius + distance,
                    timingHalfWidth + buffer,
                    timingHalfHeight + buffer,
                );

                const testX = bubbleX + offset.x;
                const testY = bubbleY + offset.y;
                if (isValidPosition(testX, testY, bubbleRadius)) {
                    return {
                        timingX: testX,
                        timingY: testY,
                    };
                }
            }
        }
        console.warn(`[RouteThing][computeRouteTimingInfo] RouteTiming not placed, route ${routeThingPreInfo.etaInfo.journey.route}, ${routeThingPreInfo.bubbleAngle}deg`);
        return {
            timingX: 0,
            timingY: 0,
        };

        /* -------------------------------------------------------------------------- */
        function getTimingOffset(θ: number, r: number, w: number, h: number): { x: number, y: number } {
            const cos_θ = Math.cos(θ);
            const sin_θ = Math.sin(θ);

            if (Math.abs((r + h) / Math.tan(θ)) <= w) {
                const y = Math.sign(sin_θ) * (h + r);
                const x = y / Math.tan(θ);
                return { x, y };
            } else if (Math.abs((r + w) * Math.tan(θ)) <= h) {
                const x = Math.sign(cos_θ) * (w + r);
                const y = x * Math.tan(θ);
                return { x, y };
            } else {
                /*
                    | Math.sign(x) | Math.sign(y) |              α               |
                    |--------------|--------------|------------------------------|
                    |      +1      |      +1      | + Math.atan(h / w)           |
                    |      -1      |      +1      | - Math.atan(h / w) + Math.PI |
                    |      +1      |      -1      | - Math.atan(h / w)           |
                    |      -1      |      -1      | + Math.atan(h / w) - Math.PI |
                 */
                const α = (Math.sign(cos_θ) * (Math.atan(h / w) - Math.PI / 2) + Math.PI / 2) * Math.sign(sin_θ);

                const d = Math.sqrt(w ** 2 + h ** 2);
                const σ = θ - α;
                const τ = Math.asin(d / r * Math.sin(σ));
                const φ = θ + τ;

                const x = w * Math.sign(cos_θ) + r * Math.cos(φ);
                const y = h * Math.sign(sin_θ) + r * Math.sin(φ);
                return { x, y };
            }
        }
        function isValidPosition(testX: number, testY: number, bubbleRadius: number): boolean {
            const absX = Math.abs(testX);
            const absY = Math.abs(testY);

            const MAX_TIMING_X = 1.9;
            const MAX_TIMING_Y = 2;
            const withinScreen = absX <= MAX_TIMING_X && absY <= MAX_TIMING_Y;

            const collideClockFace = MathExtra.circleRectangleCollide(
                { x: 0, y: 0, r: clockFaceRadius },
                { x: testX, y: testY, w2: timingHalfWidth, h2: timingHalfHeight },
                -0.01,
            );

            const collideRouteBubbles = routeThingPreInfos.some(info => {
                const { x: bubbleX, y: bubbleY } = MathExtra.clockPolarToXY(info.bubbleAngle, info.bubbleDistance);
                return MathExtra.circleRectangleCollide(
                    { x: bubbleX, y: bubbleY, r: bubbleRadius },
                    { x: testX, y: testY, w2: timingHalfWidth, h2: timingHalfHeight },
                    -0.01,
                );
            });

            const collideRouteTimings = routeTimingPositions.some(pos => {
                return MathExtra.rectangleRectangleCollide(
                    { x: testX, y: testY, w2: timingHalfWidth, h2: timingHalfHeight },
                    { x: pos.x, y: pos.y, w2: timingHalfWidth, h2: timingHalfHeight },
                    -0.1,
                );
            });

            //TODO: Implement collision with route annotation lines

            return withinScreen && !collideClockFace && !collideRouteBubbles && !collideRouteTimings;
        }
    }
}

export function RouteThing({ routeThingInfo }: { routeThingInfo: RouteThingInfo }) {
    const {
        etaInfo,
        remainingSeconds,
        bubbleScale,
        bubbleAngle,
        bubbleDistance,
        bubbleAlpha,
        annotationLineLength,
        timingX,
        timingY,
    } = routeThingInfo;
    // 
    const { theme } = useTheme();
    const { settings } = useSettings();

    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const opacity = (settings.dimDistantInfo ? bubbleAlpha : 1) * (remainingSeconds > 0 ? 1 : 0.5);
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    const bubbleColour = Colour.mixRGBA(theme.background, routeColour, opacity);
    const routeTextColour = Colour.mixRGBA(bubbleColour, contrastColour, opacity + 0.2);
    const timingColour = Colour.mixRGBA(theme.background, routeColour, opacity + 0.15);

    const { degrees: timingAngle, distance: timingDistance } = MathExtra.xyToClockPolar(timingX, timingY);

    return (
        <>
            <ClockThing
                degrees={bubbleAngle} distance={bubbleDistance}
                type={ClockThingType.ROUTE_ANNOTATION_LINE}
                style={{
                    backgroundColour: bubbleColour,
                    height: annotationLineLength,
                }}
            />
            <ClockThing
                degrees={bubbleAngle} distance={bubbleDistance}
                type={ClockThingType.ROUTE_BUBBLE}
                style={{
                    backgroundColour: bubbleColour,
                    textColour: routeTextColour,
                    scale: bubbleScale,
                }}
            >
                {etaInfo.journey.route}
            </ClockThing>
            <ClockThing
                degrees={timingAngle} distance={timingDistance}
                type={ClockThingType.ROUTE_TIMING}
                style={{ textColour: timingColour }}
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
    const { settings } = useSettings();

    return useMemo(() => {
        if (isEtaError(etaInfos)) { return handleErrors(etaInfos); }

        const routeThingInfos: RouteThingInfo[] = [];
        const rawRouteThingInfos = computeRouteThingInfos(
            etaInfos.sort((a, b) => a.etaFromTime.getTime() - b.etaFromTime.getTime()),
            currentTime,
            settings.timingShowMinutes,
        );
        for (let i = MAX_ORBIT_COUNT - 1; i >= 0; i--) {
            routeThingInfos.push(...rawRouteThingInfos.filter(info => info.bubbleOrbit === i));
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
                    const condensedRouteDays: { [route: string]: number[] } = {};
                    for (const route of (etaError as NoServiceTodayError).routes) {
                        const routeName = route.replaceAll('_', '');
                        const routeDays = busRouteInfos[route].days;
                        condensedRouteDays[routeName] = (condensedRouteDays[routeName] ?? []).concat(routeDays);
                    }
                    for (const route in condensedRouteDays) {
                        msg += `\nRoute ${route} - ${condensedRouteDays[route].sort((a, b) => a - b).map(day => weekDays[day]).join(', ')} only`;
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