import { BusRoute, busRouteInfos, busStationTimings, Coordinates, Region, regionPolygons, Station, stationCoordinates, stationRegions, termini } from "@/constants/BusData";
import { LocationExtra, MathExtra } from "@/utils/Helper";
import { isPublicHoliday } from "@/utils/PublicHolidayScraper";

export type EtaInfo = {
    journey: Journey,
    etaFromTime: Date,
    etaToTime: Date,
    isLastService: boolean,
}
export type LocationNullable = Station | Region | null;
export type FromTo = {
    from: LocationNullable,
    to: LocationNullable,
};

function isRegion(x: Exclude<LocationNullable, null>): x is Region {
    return Object.values(Region).includes(x as Region);
}

/* -------------------------------------------------------------------------- */
export enum EtaErrorType {
    INTERNAL_API_ERROR,
    NO_ROUTE_FOUND,
    OUT_OF_SERVICE_HOURS,
    NO_SERVICE_TODAY,
    NO_SERVICE_WITHIN_PEEK_TIME,
}
export class EtaError {
    private readonly type: EtaErrorType;
    constructor(type: EtaErrorType) { this.type = type; }
    isType(type: EtaErrorType): boolean { return this.type === type; }
}
export class InternalApiError extends EtaError {
    constructor() {
        super(EtaErrorType.INTERNAL_API_ERROR);
    }
}
export class NoRouteFoundError extends EtaError {
    constructor() {
        super(EtaErrorType.NO_ROUTE_FOUND);
    }
}
export class OutOfServiceHoursError extends EtaError {
    readonly routes: BusRoute[];
    constructor(routes: BusRoute[]) {
        super(EtaErrorType.OUT_OF_SERVICE_HOURS);
        this.routes = routes;
    }
}
export class NoServiceTodayError extends EtaError {
    readonly routes: BusRoute[];
    constructor(routes: BusRoute[]) {
        super(EtaErrorType.NO_SERVICE_TODAY);
        this.routes = routes;
    }
}
export class NotWithinPeekTimeError extends EtaError {
    constructor() {
        super(EtaErrorType.NO_SERVICE_WITHIN_PEEK_TIME);
    }
}
export function isEtaInfo(value: EtaInfo | EtaInfo[] | EtaError): value is EtaInfo { return !isEtaError(value); }
export function isEtaInfoArray(value: EtaInfo | EtaInfo[] | EtaError): value is EtaInfo[] { return Array.isArray(value) && value.every(isEtaInfo); }
export function isEtaError(value: EtaInfo | EtaInfo[] | EtaError): value is EtaError { return value instanceof EtaError; }
/* -------------------------------------------------------------------------- */

export function getEtaInfos({ from, to }: FromTo, currentTime: Date, pastPeekMinutes: number, futurePeekMinutes: number, detectHolidays: boolean): EtaInfo[] | EtaError {
    /*
    !   Error handling order:
        - Internal API error
        - No route found
        - Out of service hours
        - No service today
        - Not within peek time
    */

    if (!from || !to) { return []; }

    const pastPeekTimestamp = new Date(currentTime.getTime() - pastPeekMinutes * 60000);
    const futurePeekTimestamp = new Date(currentTime.getTime() + futurePeekMinutes * 60000);

    const fromStations = isRegion(from) ? stationRegions[from] : [from];
    const toStations = isRegion(to) ? stationRegions[to] : [to];

    const etaInfos: (EtaInfo | EtaError)[] = [];
    const journeys: Journey[] = [];
    for (const fromStation of fromStations) {
        for (const toStation of toStations) {
            journeys.push(...findJourney(fromStation, toStation));
        }
    }
    if (journeys.length === 0) { return new NoRouteFoundError; }

    type ScoredJourney = Journey & { score: number };
    const scoredJourneys: ScoredJourney[] = journeys.map(journey => ({ ...journey, score: scoredJourney(journey) }));
    const shortestRouteJourneys: Journey[] = [];
    const routes = new Set(scoredJourneys.map(journey => journey.route));
    for (const route of routes) {
        const routeJourneys = scoredJourneys.filter(journey => journey.route === route);
        const minScore = Math.min(...routeJourneys.map(journey => journey.score));
        shortestRouteJourneys.push(...routeJourneys.filter(journey => journey.score === minScore));
    }

    for (const journey of shortestRouteJourneys) {
        etaInfos.push(...[getStationRouteETA(journey, currentTime, detectHolidays)].flat());
    }

    const etaErrors = etaInfos.filter(etaInfo => isEtaError(etaInfo));
    const errorlessEtaInfos = etaInfos.filter(etaInfo => isEtaInfo(etaInfo));
    const withinPeekValidEtaInfos = errorlessEtaInfos.filter(eta => eta.etaFromTime >= pastPeekTimestamp && eta.etaFromTime <= futurePeekTimestamp);

    const hasNotWithinPeekTime = errorlessEtaInfos.length !== 0 && withinPeekValidEtaInfos.length !== errorlessEtaInfos.length;
    const hasInternalApiError = etaErrors.some(etaError => etaError.isType(EtaErrorType.INTERNAL_API_ERROR));
    const hasOutOfServiceHoursError = etaErrors.some(etaError => etaError.isType(EtaErrorType.OUT_OF_SERVICE_HOURS));
    const hasNoServiceTodayError = etaErrors.some(etaError => etaError.isType(EtaErrorType.NO_SERVICE_TODAY));
    const hasLastService = errorlessEtaInfos.some(eta => eta.isLastService);

    if (hasInternalApiError) { return new InternalApiError; }
    if (errorlessEtaInfos.length !== 0 && withinPeekValidEtaInfos.length !== 0) { return withinPeekValidEtaInfos; }
    if (hasNotWithinPeekTime && !hasLastService) { return new NotWithinPeekTimeError; }
    if (hasOutOfServiceHoursError || (hasNotWithinPeekTime && hasLastService)) {
        return new OutOfServiceHoursError(
            etaErrors.filter(etaError => etaError.isType(EtaErrorType.OUT_OF_SERVICE_HOURS))
                .map(etaError => (etaError as OutOfServiceHoursError).routes)
                .flat()
                .sort()
        );
    }
    if (errorlessEtaInfos.length !== 0 && withinPeekValidEtaInfos.length == 0) { return new NotWithinPeekTimeError; }
    if (hasNoServiceTodayError) {
        return new NoServiceTodayError(
            etaErrors.filter(etaError => etaError.isType(EtaErrorType.NO_SERVICE_TODAY))
                .map(etaError => (etaError as NoServiceTodayError).routes)
                .flat()
                .sort()
        );
    }
    return new InternalApiError;

    /* -------------------------------------------------------------------------- */
    function scoredJourney(journey: Journey): number {
        // Lower score is better
        const { fromIndex, toIndex } = journey;

        return toIndex - fromIndex;
    }
}

export type Journey = {
    route: BusRoute,
    fromStation: Station,
    fromIndex: number,
    toStation: Station,
    toIndex: number,
};
function findJourney(fromStation: Station, toStation: Station): Journey[] {
    const journeys: Journey[] = [];
    for (const r in busRouteInfos) {
        const route = r as BusRoute;
        const routeInfo = busRouteInfos[route];

        const fromIndices: number[] = routeInfo.stations.map((station, index) => station === fromStation ? index : NaN);
        const toIndices: number[] = routeInfo.stations.map((station, index) => station === toStation ? index : NaN);

        for (const fromIndex of fromIndices) {
            for (const toIndex of toIndices) {
                if (fromIndex < toIndex) {
                    journeys.push({ route, fromIndex, toIndex, fromStation, toStation });
                }
            }
        }
    };
    return journeys;
}

function getStationRouteETA(journey: Journey, currentTime: Date, detectHolidays: boolean): EtaInfo[] | EtaError {
    const routeInfo = busRouteInfos[journey.route];
    if (!routeInfo) { return new InternalApiError; }
    if (!routeInfo.serviceDays.includes(
        detectHolidays && isPublicHoliday(currentTime)
            ? 0
            : currentTime.getDay())
    ) { return new NoServiceTodayError([journey.route]); }
    if (!routeInfo.stations.find(s => s === journey.fromStation)) { return new InternalApiError; }
    const routeStartStationTimeOffsetSeconds = getRouteStationTimeOffsetSeconds(journey.fromIndex);
    const routeEndStationTimeOffsetSeconds = getRouteStationTimeOffsetSeconds(journey.toIndex);
    const currentHour = currentTime.getHours();

    const etaInfos: (EtaInfo | null)[] = [];

    for (const minuteMark of routeInfo.minuteMarks) {
        const pastHourMarkTime = new Date(currentTime);
        const currentHourMarkTime = new Date(currentTime);
        const futureHourMarkTime = new Date(currentTime);

        pastHourMarkTime.setHours(currentHour - 1, minuteMark, 0, 0);
        currentHourMarkTime.setHours(currentHour, minuteMark, 0, 0);
        futureHourMarkTime.setHours(currentHour + 1, minuteMark, 0, 0);

        const pastHourEtaFromTime = pastHourMarkTime.add({ seconds: routeStartStationTimeOffsetSeconds });
        const currentHourEtaFromTime = currentHourMarkTime.add({ seconds: routeStartStationTimeOffsetSeconds });
        const futureHourEtaFromTime = futureHourMarkTime.add({ seconds: routeStartStationTimeOffsetSeconds });

        const pastHourEtaToTime = pastHourMarkTime.add({ seconds: routeEndStationTimeOffsetSeconds });
        const currentHourEtaToTime = currentHourMarkTime.add({ seconds: routeEndStationTimeOffsetSeconds });
        const futureHourEtaToTime = futureHourMarkTime.add({ seconds: routeEndStationTimeOffsetSeconds });

        etaInfos.push(
            isWithinServiceHours(pastHourMarkTime)
                ? {
                    journey,
                    etaFromTime: pastHourEtaFromTime,
                    etaToTime: pastHourEtaToTime,
                    isLastService: !isWithinServiceHours(pastHourEtaFromTime),
                }
                : null,
            isWithinServiceHours(currentHourMarkTime)
                ? {
                    journey,
                    etaFromTime: currentHourEtaFromTime,
                    etaToTime: currentHourEtaToTime,
                    isLastService: !isWithinServiceHours(currentHourEtaFromTime),
                }
                : null,
            isWithinServiceHours(futureHourMarkTime)
                ? {
                    journey,
                    etaFromTime: futureHourEtaFromTime,
                    etaToTime: futureHourEtaToTime,
                    isLastService: !isWithinServiceHours(futureHourEtaFromTime),
                }
                : null,
        );
    };

    const inServiceHoursEtaInfos = etaInfos.filter(eta => eta !== null)
    return inServiceHoursEtaInfos.length === 0 ? new OutOfServiceHoursError([journey.route]) : inServiceHoursEtaInfos;

    /* -------------------------------------------------------------------------- */
    function getRouteStationTimeOffsetSeconds(stationIndex: number): number {
        if (!routeInfo) { throw new Error('[Bus][getRouteStationTimeOffsetSeconds] Route info not found'); }
        const stations = routeInfo.stations;

        const DEFAULT_STATION_TIME_OFFSET_SECONDS = 120.5;
        let stationTime = 0;
        for (let i = 0; i < stationIndex; i++) {
            stationTime += MathExtra.average(...busStationTimings[`${stations[i]}>>${stations[i + 1]}`])
                || (() => {
                    console.warn(`[Bus][getRouteStationTimeOffsetSeconds] Timing ${stations[i]}>>${stations[i + 1]} not found!`);
                    return DEFAULT_STATION_TIME_OFFSET_SECONDS;
                })();
        }
        return Math.round(stationTime);
    }
    function isWithinServiceHours(time: Date): boolean {
        if (!routeInfo) { throw new Error('[Bus][isWithinServiceHours] Route info not found'); }

        const yesterdayFirstService = new Date(currentTime).add({ days: -1 });
        const yesterdayLastService = new Date(currentTime).add({ days: -1 });
        const todayFirstService = new Date(currentTime);
        const todayLastService = new Date(currentTime);
        const tomorrowFirstService = new Date(currentTime).add({ days: 1 });
        const tomorrowLastService = new Date(currentTime).add({ days: 1 });

        yesterdayFirstService.setHours(routeInfo.firstService[0], routeInfo.firstService[1], 0, 0);
        yesterdayLastService.setHours(routeInfo.lastService[0], routeInfo.lastService[1], 0, 0);
        todayFirstService.setHours(routeInfo.firstService[0], routeInfo.firstService[1], 0, 0);
        todayLastService.setHours(routeInfo.lastService[0], routeInfo.lastService[1], 0, 0);
        tomorrowFirstService.setHours(routeInfo.firstService[0], routeInfo.firstService[1], 0, 0);
        tomorrowLastService.setHours(routeInfo.lastService[0], routeInfo.lastService[1], 0, 0);

        return (time >= yesterdayFirstService && time <= yesterdayLastService)
            || (time >= todayFirstService && time <= todayLastService)
            || (time >= tomorrowFirstService && time <= tomorrowLastService);
    }
}

/* -------------------------------------------------------------------------- */
export function getRegionFromGPS(gpsLocation: Coordinates): Region | null {
    for (const [regionName, polygon] of Object.entries(regionPolygons)) {
        if (LocationExtra.pointIsInPolygon(gpsLocation, polygon)) {
            console.log(`[JourneyPlanner][getRegionFromGPS] GPS within region: ${regionName}`);
            return regionName as Region;
        }
    }
    return null;
}
export function getStationFromGPS(gpsLocation: Coordinates): Station | null {
    const MAX_TOLERABLE_DISTANCE = 200; // in metres

    const stations = (Object.keys(stationCoordinates) as Station[])
        .filter(station => !termini.includes(station));
    const stationDistances = stations.map(station => {
        const stationCoords: Coordinates = stationCoordinates[station];
        return LocationExtra.haversineDistance(gpsLocation.latitude, gpsLocation.longitude, stationCoords.latitude, stationCoords.longitude);
    });
    const minStationDistance = Math.min(...stationDistances);
    if (minStationDistance > MAX_TOLERABLE_DISTANCE) { return null; }
    const closestStation = stations[stationDistances.indexOf(minStationDistance)];
    console.log(`[JourneyPlanner][getStationFromGPS] GPS closest station: ${closestStation}`);
    return closestStation;
}