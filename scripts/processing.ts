import { LocationExtra } from '@/utils/Helper';
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

const stationTimesStats = Object.keys(busStationTimings).reduce((acc, key) => {
    const times = busStationTimings[key];
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length;
    const stdDev = Math.sqrt(variance);
    acc[key] = { mean, stdDev };
    return acc;
}, {} as Record<string, { mean: number, stdDev: number }>);
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

    const stationPairString = `${thisEntry.station}>>${nextEntry.station}`;
    if (!stationTimes[stationPairString]) {
        console.log(`Dropped route ${thisEntry.route} ${stationPairString} (${thisEntry.timeStamp} >> ${nextEntry.timeStamp})`);
        continue;
    }

    if (timeElapsed <= 0) {
        console.warn(`Negative time elapsed: ${timeElapsed} ${stationPairString} (${thisEntry.timeStamp} >> ${nextEntry.timeStamp})`);
        continue;
    }

    if (Math.abs(timeElapsed - stationTimesStats[stationPairString].mean) > 2 * stationTimesStats[stationPairString].stdDev) {
        console.warn(`Permitted route ${thisEntry.route}: |Time elapsed (${timeElapsed}) - Mean (${stationTimesStats[stationPairString].mean})| > 2 SDs (${Math.round(stationTimesStats[stationPairString].stdDev)}) for ${stationPairString} (${thisEntry.timeStamp} >> ${nextEntry.timeStamp})`);
    }

    stationTimes[stationPairString].push(timeElapsed);
}

fs.writeFileSync('./data/station-times.json', JSON.stringify(stationTimes, null, 0));

/* -------------------------------------------------------------------------- */

function getStation(route: BusRoute, latitude: number, longitude: number): Station {
    const routeInfo = busRouteInfos[route];
    if (!routeInfo) { throw new Error(`Route ${route} not found`); }

    const stationDistances = routeInfo.stations.map(station => {
        const stationCoords: Coordinates = stationCoordinates[station];
        return LocationExtra.haversineDistance(latitude, longitude, stationCoords.latitude, stationCoords.longitude);
    });
    const closestStation = routeInfo.stations[stationDistances.indexOf(Math.min(...stationDistances))];
    return closestStation;
}