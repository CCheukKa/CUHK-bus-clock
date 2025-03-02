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

export function getEtaInfos({ from, to }: FromTo, currentTime: Date, pastPeekMinutes: number, futurePeekMinutes: number): EtaInfo[] {
    if (!from || !to) { return []; }

    const pastPeekTimestamp = new Date(currentTime.getTime() - pastPeekMinutes * 60000);
    const futurePeekTimestamp = new Date(currentTime.getTime() + futurePeekMinutes * 60000);

    const fromStations = isRegion(from) ? stationRegions[from] : [from];
    const toStations = isRegion(to) ? stationRegions[to] : [to];

    const etaInfos: EtaInfo[] = [];
    const journeys: Journey[] = [];
    fromStations.forEach(fromStation => {
        toStations.forEach(toStation => {
            journeys.push(...findJourney(fromStation, toStation));
        });
    });

    type ScoredJourney = Journey & { score: number };
    const scoredJourneys: ScoredJourney[] = journeys.map(journey => ({ ...journey, score: scoredJourney(journey) }));
    const filteredJourneys: Journey[] = [];
    const routes = new Set(scoredJourneys.map(journey => journey.route));
    routes.forEach(route => {
        const routeJourneys = scoredJourneys.filter(journey => journey.route === route);
        const minScore = Math.min(...routeJourneys.map(journey => journey.score));
        filteredJourneys.push(...routeJourneys.filter(journey => journey.score === minScore));
    });

    filteredJourneys.forEach(filteredJourney => {
        etaInfos.push(...getStationRouteETA(
            filteredJourney,
            currentTime,
            pastPeekTimestamp,
            futurePeekTimestamp)
            ?? []
        );
    });

    return etaInfos;
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

function getStationRouteETA(journey: Journey, currentTime: Date, pastPeekTimestamp: Date, futurePeekTimestamp: Date): EtaInfo[] | void {
    const routeInfo = busRouteInfos[journey.route];
    if (!routeInfo) { return; }
    if (!routeInfo.days.includes(currentTime.getDay())) { return; }
    if (!routeInfo.stations.find(s => s === journey.fromStation)) { return; }
    const routeStationTime = getRouteStationTime();

    const currentHour = currentTime.getHours();

    const etaInfos: EtaInfo[] = [];

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
            { journey, etaTime: isWithinServiceHours(pastHourStartTime) ? pastHourEtaTime : new Date(Infinity) },
            { journey, etaTime: isWithinServiceHours(currentHourStartTime) ? currentHourEtaTime : new Date(Infinity) },
            { journey, etaTime: isWithinServiceHours(futureHourStartTime) ? futureHourEtaTime : new Date(Infinity) },
        );
    });

    return etaInfos.filter(eta => eta.etaTime >= pastPeekTimestamp && eta.etaTime <= futurePeekTimestamp);

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