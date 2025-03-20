import { BusRoute, busRouteInfos, busStationTimings, Coordinates, Station, stationCoordinates } from '@/constants/BusData';
import fs from 'fs';

type BusLogEntry = {
    route: BusRoute,
    timeStamp: Date,
    location: {
        coords: {
            accuracy: number,
            longitude: number,
            altitude: number,
            heading: number,
            latitude: number,
            altitudeAccuracy: number,
            speed: number,
        },
        mocked: boolean,
        timestamp: number,
    },
};

type ProcessedBusLogEntry = BusLogEntry & {
    station: Station,
};

const log: BusLogEntry[] = JSON.parse(fs.readFileSync('./data/bus-log.json', 'utf8'));
const oldProcessedLog: ProcessedBusLogEntry[] = JSON.parse(fs.readFileSync('./data/processed-bus-log.json', 'utf8'));

const filteredLog: BusLogEntry[] = log.filter(entry => !oldProcessedLog.some(oldEntry => oldEntry.timeStamp === entry.timeStamp));

const newProcessedLog: ProcessedBusLogEntry[] = filteredLog.map(entry => {
    const station = getStation(entry.route, entry.location.coords.latitude, entry.location.coords.longitude);
    return { ...entry, station };
});
console.log(`Added ${newProcessedLog.length} new entries`);

const processedLog: ProcessedBusLogEntry[] = [...oldProcessedLog, ...newProcessedLog];
processedLog.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

console.log(`Total entries: ${processedLog.length}`);

fs.writeFileSync('./data/processed-bus-log.json', JSON.stringify(processedLog, null, 4));

const stationTimes = Object.keys(busStationTimings).reduce((acc, key) => {
    acc[key] = [];
    return acc;
}, {} as Record<string, number[]>);
for (let i = 0; i < processedLog.length - 1; i++) {
    const thisEntry = processedLog[i];
    const nextEntry = processedLog[i + 1];

    if (thisEntry.route !== nextEntry.route) { continue; }

    const timeElapsed = Math.round((new Date(nextEntry.timeStamp).getTime() - new Date(thisEntry.timeStamp).getTime()) / 1000);
    if (timeElapsed > 300) { continue; }

    const string = `${thisEntry.station}>>${nextEntry.station}`;
    if (!stationTimes[string]) {
        console.log(`Dropped route ${thisEntry.route} ${string} (${thisEntry.timeStamp} >> ${nextEntry.timeStamp})`);
        continue;
    }

    stationTimes[string].push(timeElapsed);
}

fs.writeFileSync('./data/station-times.json', JSON.stringify(stationTimes, null, 4));

/* -------------------------------------------------------------------------- */

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

function getStation(route: BusRoute, latitude: number, longitude: number): Station {
    const routeInfo = busRouteInfos[route];
    if (!routeInfo) { throw new Error(`Route ${route} not found`); }

    const stationDistances = routeInfo.stations.map(station => {
        const stationCoords: Coordinates = stationCoordinates[station];
        return haversineDistance(latitude, longitude, stationCoords.latitude, stationCoords.longitude);
    });
    const closestStation = routeInfo.stations[stationDistances.indexOf(Math.min(...stationDistances))];
    return closestStation;
}