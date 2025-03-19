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
};
type RouteAnnotationLineInfo = {
    annotationLineLength: number;
};
type RouteEtaCountdownInfo = {
    etaCountdownX: number;
    etaCountdownY: number;
};
type RouteThingBasicInfo = {
    etaInfo: EtaInfo;
    remainingSeconds: number;
};
type RouteThingInfo = RouteThingBasicInfo & RouteBubbleInfo & RouteAnnotationLineInfo & RouteEtaCountdownInfo;
type RouteThingPreInfo = RouteThingBasicInfo & RouteBubbleInfo & RouteAnnotationLineInfo;
const MAX_ORBIT_COUNT = 3;
function computeRouteThingInfos(etaInfos: EtaInfo[], currentTime: Date): RouteThingInfo[] {
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
    const routeEtaCountdownPositions: { x: number, y: number }[] = [];
    for (const routeThingPreInfo of routeThingPreInfos) {
        const routeEtaCountdownInfo = computeRouteEtaCountdownInfo(routeThingPreInfos, routeThingPreInfo);
        routeEtaCountdownPositions.push({ x: routeEtaCountdownInfo.etaCountdownX, y: routeEtaCountdownInfo.etaCountdownY });
        routeThingInfos.push({
            ...routeThingPreInfo,
            ...routeEtaCountdownInfo,
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
            console.warn(`RouteBubble not placed, route ${etaInfo.journey.route}, ${bubbleAngle}deg`);
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

        return {
            bubbleScale,
            bubbleAngle,
            bubbleDistance,
            bubbleOrbit,
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
    function computeRouteEtaCountdownInfo(routeThingPreInfos: RouteThingPreInfo[], routeThingPreInfo: RouteThingPreInfo): RouteEtaCountdownInfo {
        const clockFaceRadius = 1;
        //TODO: find a way to calculate this exactly
        const bubbleRadius = routeThingPreInfo.bubbleScale * 0.1;
        //TODO: find a way to calculate this exactly based on rendered size
        const etaCountdownWidth = 0.32; // width / 2
        //TODO: find a way to calculate this exactly based on rendered size
        const etaCountdownHeight = 0.14; // height / 2
        const { x: bubbleX, y: bubbleY } = MathExtra.clockPolarToXY(routeThingPreInfo.bubbleAngle, routeThingPreInfo.bubbleDistance);

        const isUpperHalf = bubbleY >= 0;
        const isRightHalf = bubbleX >= 0;
        const etaCountdownRelativeAngleOffsets = [0, -10, 10, -20, 20, -30, 30, -40, 40, -45, 45];
        const etaCountdownRelativeAngle = etaCountdownRelativeAngleOffsets.map(angleOffset => [
            isRightHalf
                ? [angleOffset + 90, angleOffset + 270]
                : [angleOffset + 270, angleOffset + 90],
            isUpperHalf
                ? [angleOffset + 0, angleOffset + 180]
                : [angleOffset + 180, angleOffset + 0],
            angleOffset + routeThingPreInfo.bubbleAngle,
        ]).flat(2);
        const etaCountdownDistances = [0, 0.05, 0.1, 0.15];

        //TODO: Implement recursive backtracking on failure
        for (let distance of etaCountdownDistances) {
            for (let clockAngle of etaCountdownRelativeAngle) {
                const buffer = 0;

                const offset = getEtaCountdownOffset(
                    (-clockAngle + 90) * Math.PI / 180,
                    bubbleRadius + distance,
                    etaCountdownWidth + buffer,
                    etaCountdownHeight + buffer,
                );

                const testX = bubbleX + offset.x;
                const testY = bubbleY + offset.y;
                if (isValidPosition(testX, testY, bubbleRadius)) {
                    return {
                        etaCountdownX: testX,
                        etaCountdownY: testY,
                    };
                }
            }
        }
        console.warn(`RouteEtaCountdown not placed, route ${routeThingPreInfo.etaInfo.journey.route}, ${routeThingPreInfo.bubbleAngle}deg`);
        return {
            etaCountdownX: 0,
            etaCountdownY: 0,
        };

        /* -------------------------------------------------------------------------- */
        function getEtaCountdownOffset(θ: number, r: number, w: number, h: number): { x: number, y: number } {
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

            const MAX_EtaCountdown_X = 1.9;
            const MAX_EtaCountdown_Y = 2;
            const withinScreen = absX <= MAX_EtaCountdown_X && absY <= MAX_EtaCountdown_Y;

            const collideClockFace = MathExtra.circleRectangleCollide(
                { x: 0, y: 0, r: clockFaceRadius },
                { x: testX, y: testY, w2: etaCountdownWidth, h2: etaCountdownHeight },
                -0.01,
            );

            const collideRouteBubbles = routeThingPreInfos.some(info => {
                const { x: bubbleX, y: bubbleY } = MathExtra.clockPolarToXY(info.bubbleAngle, info.bubbleDistance);
                return MathExtra.circleRectangleCollide(
                    { x: bubbleX, y: bubbleY, r: bubbleRadius },
                    { x: testX, y: testY, w2: etaCountdownWidth, h2: etaCountdownHeight },
                    -0.01,
                );
            });

            const collideRouteEtaCountdowns = routeEtaCountdownPositions.some(pos => {
                return MathExtra.rectangleRectangleCollide(
                    { x: testX, y: testY, w2: etaCountdownWidth, h2: etaCountdownHeight },
                    { x: pos.x, y: pos.y, w2: etaCountdownWidth, h2: etaCountdownHeight },
                    -0.1,
                );
            });

            //TODO: Implement collision with route annotation lines

            return withinScreen && !collideClockFace && !collideRouteBubbles && !collideRouteEtaCountdowns;
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
        annotationLineLength,
        etaCountdownX,
        etaCountdownY,
    } = routeThingInfo;
    // 
    const { theme } = useTheme();
    const { settings } = useSettings();

    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const opacity = remainingSeconds > 0 ? 1 : 0.75;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;

    const { degrees: etaCountdownAngle, distance: etaCountdownDistance } = MathExtra.xyToClockPolar(etaCountdownX, etaCountdownY);

    return (
        <>
            <ClockThing
                degrees={bubbleAngle} distance={bubbleDistance}
                type={ClockThingType.ROUTE_ANNOTATION_LINE}
                style={{
                    backgroundColour: Colour.mixRGBA(theme.background, routeColour, opacity),
                    height: annotationLineLength,
                }}
            />
            <ClockThing
                degrees={bubbleAngle} distance={bubbleDistance}
                type={ClockThingType.ROUTE_BUBBLE}
                style={{
                    backgroundColour: Colour.mixRGBA(theme.background, routeColour, opacity),
                    textColour: contrastColour,
                    scale: bubbleScale,
                }}
            >
                {etaInfo.journey.route}
            </ClockThing>
            <ClockThing
                degrees={etaCountdownAngle} distance={etaCountdownDistance}
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