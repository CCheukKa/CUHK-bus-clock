import { BusRoute, busRouteInfos, busStationTimings, Region, Station, stationRegions } from "@/constants/BusData";

//! TODO:
//! add support for public holidays
//! scrape here?: https://www.gov.hk/en/about/abouthk/holiday/2025.htm

//! TODO:
//! update data structure to use a matrix?

export type EtaInfo = {
    station: Station,
    route: BusRoute,
    etaTime: Date,
}
export type FromTo = {
    from: Station | Region,
    to: Station | Region,
};

function isRegion(x: Station | Region): x is Region {
    return Object.values(Region).includes(x as Region);
}

export function getETAs({ from, to }: FromTo, currentTime: Date, pastMinutes: number, futureMinutes: number): EtaInfo[] {
    const pastTimeLimit = new Date(currentTime.getTime() - pastMinutes * 60000);
    const futureTimeLimit = new Date(currentTime.getTime() + futureMinutes * 60000);

    const fromStations = isRegion(from) ? stationRegions[from] : [from];
    const toStations = isRegion(to) ? stationRegions[to] : [to];

    const etas: EtaInfo[] = [];
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
        etas.push(...getStationRouteETA(
            busRouteInfos[filteredJourney.route].stations[filteredJourney.fromIndex],
            filteredJourney.route,
            currentTime,
            pastTimeLimit,
            futureTimeLimit)
            ?? []
        );
    });

    return etas;
    /* -------------------------------------------------------------------------- */

    function scoredJourney(journey: Journey): number {
        // Lower score is better
        const { route, fromIndex, toIndex } = journey;

        return toIndex - fromIndex;
    }
}

export type Journey = { route: BusRoute, fromIndex: number, toIndex: number };
function findJourney(fromStation: Station, toStation: Station): Journey[] {
    const journeys: Journey[] = [];
    Object.entries(busRouteInfos).forEach(([route, routeInfo]) => {
        const fromIndex = routeInfo.stations.findIndex(s => s === fromStation);
        if (fromIndex == -1) { return; }
        const toIndex = routeInfo.stations.findIndex(s => s === toStation);
        if (toIndex == -1) { return; }

        if (fromIndex < toIndex) { journeys.push({ route: route as BusRoute, fromIndex, toIndex }); }
    });
    return journeys;
}

function getStationRouteETA(station: Station, route: BusRoute, currentTime: Date, pastTimeLimit: Date, futureTimeLimit: Date): EtaInfo[] | void {
    const routeInfo = busRouteInfos[route];
    if (!routeInfo) { return; }
    if (!routeInfo.days.includes(currentTime.getDay())) { return; }
    if (!routeInfo.stations.find(s => s === station)) { return; }
    const routeStationTime = getRouteStationTime();

    const currentHour = currentTime.getHours();

    const etas: EtaInfo[] = [];

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

        etas.push(
            { station, route, etaTime: isWithinServiceHours(pastHourStartTime) ? pastHourEtaTime : new Date(Infinity) },
            { station, route, etaTime: isWithinServiceHours(currentHourStartTime) ? currentHourEtaTime : new Date(Infinity) },
            { station, route, etaTime: isWithinServiceHours(futureHourStartTime) ? futureHourEtaTime : new Date(Infinity) },
        );
    });

    return etas.filter(eta => eta.etaTime >= pastTimeLimit && eta.etaTime <= futureTimeLimit);

    /* -------------------------------------------------------------------------- */
    function getRouteStationTime(): number {
        if (!routeInfo) { throw new Error('Route info not found but getRouteStationTime() is called'); }
        const stations = routeInfo.stations;

        let stationTime = 0;
        const stationIndex = stations.findIndex(s => s === station);
        for (let i = 1; i < stationIndex; i++) {
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

/* -------------------------------------------------------------------------- */
declare global {
    interface Date {
        add(
            hours: number,
            minutes?: number,
            seconds?: number,
            milliseconds?: number
        ): Date;
    }
}
Date.prototype.add = function (this: Date, hours?, minutes?, seconds?, milliseconds?): Date {
    return new Date(this.getTime() + (hours ?? 0) * 3600000 + (minutes ?? 0) * 60000 + (seconds ?? 0) * 1000 + (milliseconds ?? 0));
};