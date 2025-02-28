import { BusRoute, busRouteInfos, Coordinates, Region, Station, stationCoordinates, stationRegions } from '@/constants/BusData';
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

const processedLog: ProcessedBusLogEntry[] = log.map(entry => {
    const station = getStation(entry.route, entry.location.coords.latitude, entry.location.coords.longitude);
    return { ...entry, station };
});

fs.writeFileSync('./data/processed-bus-log.json', JSON.stringify(processedLog, null, 4));

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
    const routeInfo = busRouteInfos.get(route);
    if (!routeInfo) { throw new Error(`Route ${route} not found`); }

    const stationDistances = routeInfo.stations.map(station => {
        const stationCoords: Coordinates = stationCoordinates[station];
        return haversineDistance(latitude, longitude, stationCoords.latitude, stationCoords.longitude);
    });
    const closestStation = routeInfo.stations[stationDistances.indexOf(Math.min(...stationDistances))];
    return closestStation;
}