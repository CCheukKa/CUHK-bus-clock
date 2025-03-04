import { BusRoute, busRouteInfos, busStationTimings, Region, Station, stationRegions } from "@/constants/BusData";

//! TODO:
//! add support for public holidays
//! scrape here?: https://www.gov.hk/en/about/abouthk/holiday/2025.htm

export type EtaInfo = {
    journey: Journey,
    etaTime: Date,
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

export function getEtaInfos({ from, to }: FromTo, currentTime: Date, pastPeekMinutes: number, futurePeekMinutes: number): EtaInfo[] | EtaError {
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
    fromStations.forEach(fromStation => {
        toStations.forEach(toStation => {
            journeys.push(...findJourney(fromStation, toStation));
        });
    });
    if (journeys.length === 0) { return new NoRouteFoundError; }

    type ScoredJourney = Journey & { score: number };
    const scoredJourneys: ScoredJourney[] = journeys.map(journey => ({ ...journey, score: scoredJourney(journey) }));
    const shortestRouteJourneys: Journey[] = [];
    const routes = new Set(scoredJourneys.map(journey => journey.route));
    routes.forEach(route => {
        const routeJourneys = scoredJourneys.filter(journey => journey.route === route);
        const minScore = Math.min(...routeJourneys.map(journey => journey.score));
        shortestRouteJourneys.push(...routeJourneys.filter(journey => journey.score === minScore));
    });

    shortestRouteJourneys.forEach(shortestRouteJourney => {
        etaInfos.push(...[getStationRouteETA(shortestRouteJourney, currentTime)].flat());
    });

    const validEtaInfos = etaInfos.filter(etaInfo => isEtaInfo(etaInfo));
    if (validEtaInfos.length !== 0) {
        const withinPeekValidEtaInfos = validEtaInfos.filter(eta => eta.etaTime >= pastPeekTimestamp && eta.etaTime <= futurePeekTimestamp);
        return withinPeekValidEtaInfos.length === 0 ? new NotWithinPeekTimeError : withinPeekValidEtaInfos;
    }

    const etaErrors = etaInfos.filter(etaInfo => isEtaError(etaInfo));

    if (etaErrors.some(etaError => etaError.isType(EtaErrorType.INTERNAL_API_ERROR))) { return new InternalApiError; }
    if (etaErrors.some(etaError => etaError.isType(EtaErrorType.OUT_OF_SERVICE_HOURS))) {
        return new OutOfServiceHoursError(
            etaErrors.filter(etaError => etaError.isType(EtaErrorType.OUT_OF_SERVICE_HOURS))
                .map(etaError => (etaError as OutOfServiceHoursError).routes)
                .flat()
        );
    }
    if (etaErrors.some(etaError => etaError.isType(EtaErrorType.NO_SERVICE_TODAY))) {
        return new NoServiceTodayError(
            etaErrors.filter(etaError => etaError.isType(EtaErrorType.NO_SERVICE_TODAY))
                .map(etaError => (etaError as NoServiceTodayError).routes)
                .flat()
        );
    }
    return new InternalApiError;
    /* -------------------------------------------------------------------------- */

    function scoredJourney(journey: Journey): number {
        // Lower score is better
        const { route, fromIndex, toIndex } = journey;

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
    Object.entries(busRouteInfos).forEach(([route, routeInfo]) => {
        const fromIndex = routeInfo.stations.findIndex(s => s === fromStation);
        if (fromIndex == -1) { return; }
        const toIndex = routeInfo.stations.findIndex(s => s === toStation);
        if (toIndex == -1) { return; }

        if (fromIndex < toIndex) {
            journeys.push({ route: route as BusRoute, fromIndex, toIndex, fromStation, toStation });
        }
    });
    return journeys;
}

function getStationRouteETA(journey: Journey, currentTime: Date): EtaInfo[] | EtaError {
    const routeInfo = busRouteInfos[journey.route];
    if (!routeInfo) { return new InternalApiError; }
    if (!routeInfo.days.includes(currentTime.getDay())) { return new NoServiceTodayError([journey.route]); }
    if (!routeInfo.stations.find(s => s === journey.fromStation)) { return new InternalApiError; }
    const routeStationTime = getRouteStationTime();

    const currentHour = currentTime.getHours();

    const etaInfos: (EtaInfo | null)[] = [];

    routeInfo.minuteMarks.forEach(minuteMark => {
        const pastHourStartTime = new Date(currentTime);
        const currentHourStartTime = new Date(currentTime);
        const futureHourStartTime = new Date(currentTime);

        pastHourStartTime.setHours(currentHour - 1, minuteMark, 0, 0);
        currentHourStartTime.setHours(currentHour, minuteMark, 0, 0);
        futureHourStartTime.setHours(currentHour + 1, minuteMark, 0, 0);

        const pastHourEtaTime = pastHourStartTime.add(0, 0, routeStationTime);
        const currentHourEtaTime = currentHourStartTime.add(0, 0, routeStationTime);
        const futureHourEtaTime = futureHourStartTime.add(0, 0, routeStationTime);

        etaInfos.push(
            isWithinServiceHours(pastHourStartTime) ? { journey, etaTime: pastHourEtaTime } : null,
            isWithinServiceHours(currentHourStartTime) ? { journey, etaTime: currentHourEtaTime } : null,
            isWithinServiceHours(futureHourStartTime) ? { journey, etaTime: futureHourEtaTime } : null,
        );
    });

    const inServiceHoursEtaInfos = etaInfos.filter(eta => eta !== null)
    return inServiceHoursEtaInfos.length === 0 ? new OutOfServiceHoursError([journey.route]) : inServiceHoursEtaInfos;

    /* -------------------------------------------------------------------------- */
    function getRouteStationTime(): number {
        if (!routeInfo) { throw new Error('Route info not found but getRouteStationTime() is called'); }
        const stations = routeInfo.stations;

        let stationTime = 0;
        for (let i = 1; i < journey.fromIndex; i++) {
            stationTime += busStationTimings[`${stations[i - 1]}>>${stations[i]}`]
                ?? (() => { throw new Error(`Timing ${stations[i - 1]} -> ${stations[i]} not found!`) })();
        }
        return stationTime;
    }
    function isWithinServiceHours(time: Date): boolean {
        if (!routeInfo) { throw new Error('Route info not found but isWithinServiceHours() is called'); }
        // 
        const hour = time.getHours();
        const minute = time.getMinutes();
        if (hour < routeInfo.firstService[0] || hour > routeInfo.lastService[0]) { return false; }
        if (hour === routeInfo.firstService[0] && minute < routeInfo.firstService[1]) { return false; }
        if (hour === routeInfo.lastService[0] && minute > routeInfo.lastService[1]) { return false; }
        return true;
    }
}