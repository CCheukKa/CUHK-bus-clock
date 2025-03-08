import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { EtaError, EtaErrorType, EtaInfo, isEtaError, NoServiceTodayError, OutOfServiceHoursError } from "@/backend/Bus";
import { busRouteInfos } from "@/constants/BusData";
import { Colour, getCountdown, MathExtra, toTimeString } from "@/backend/Helper";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import { useSettings } from "@/context/SettingsContext";

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type RouteThingProps = {
    etaInfo: EtaInfo;
    currentTime: Date;
};

export function RouteThing({ etaInfo, currentTime }: RouteThingProps) {
    const { theme } = useTheme();
    const { settings } = useSettings();

    const routeColour = busRouteInfos[etaInfo.journey.route].routeColour;
    const remainingSeconds = getCountdown(currentTime, etaInfo.etaFromTime);
    const opacity = remainingSeconds > 0 ? 1 : 0.75;
    const contrastColour = Colour.getLuminance(routeColour) > 150 ? theme.black : theme.white;
    const totalMinutes = remainingSeconds / 60;
    const routeBubbleScale = MathExtra.interpolateBetweenPins(totalMinutes, [
        { pin: -5, value: 0.6 },
        { pin: 0, value: 1 },
        { pin: 15, value: 0.6 },
    ]);
    const routeAnnotationLineLength = MathExtra.interpolateBetweenPins(totalMinutes, [
        { pin: -5, value: 75 },
        { pin: 0, value: 160 },
        { pin: 15, value: 75 },
    ]);
    const routeBubbleDistance = 1.3;
    const routeEtaCountdownDistance = MathExtra.interpolateBetweenPins(totalMinutes, [
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
        if (isEtaError(etaInfos)) {
            const errorMessage: string = (() => {
                switch (true) {
                    case etaInfos.isType(EtaErrorType.INTERNAL_API_ERROR):
                        return 'Internal API error';
                    case etaInfos.isType(EtaErrorType.NO_ROUTE_FOUND):
                        return 'No route found between these locations';
                    case etaInfos.isType(EtaErrorType.OUT_OF_SERVICE_HOURS):
                        {
                            let msg = 'Out of service hours';
                            (etaInfos as OutOfServiceHoursError).routes.forEach(route => {
                                msg += `\nRoute ${route.replaceAll('_', '')} - ${toTimeString(busRouteInfos[route].firstService, true)}-${toTimeString(busRouteInfos[route].lastService, true)}`;
                            });
                            return msg;
                        }
                    case etaInfos.isType(EtaErrorType.NO_SERVICE_TODAY):
                        {
                            let msg = 'No service between these locations today';
                            (etaInfos as NoServiceTodayError).routes.forEach(route => {
                                msg += `\nRoute ${route.replaceAll('_', '')} - ${busRouteInfos[route].days.map(day => weekDays[day]).join(', ')} only`;
                            });
                            return msg;
                        }
                    case etaInfos.isType(EtaErrorType.NO_SERVICE_WITHIN_PEEK_TIME):
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
        return etaInfos.map(etaInfo => (
            <RouteThing
                etaInfo={etaInfo}
                currentTime={currentTime}
                key={`${etaInfo.journey.route}-${etaInfo.etaFromTime.getTime()}`}
            />
        ));
    }, [etaInfos]);
}