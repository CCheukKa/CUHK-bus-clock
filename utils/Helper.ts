/**
 * A utility class for colour-related operations.
 */
export class Colour {
    /**
     * Calculates the luminance of a given hex colour.
     * 
     * @param hex - The hex colour code in the format `#RRGGBB`.
     * @returns The luminance value of the colour.
     */
    public static getLuminance(hex: string): number {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
    }

    /**
     * Mixes two hex colours with a given ratio.
     * 
     * @param colour1 - The first hex colour code in the format `#RRGGBB`.
     * @param colour2 - The second hex colour code in the format `#RRGGBB`.
     * @param ratio - The ratio to mix the colours, where 0 is all `colour1` and 1 is all `colour2`.
     * @returns The mixed hex colour code in the format `#RRGGBB`.
     */
    public static mixRGBA(colour1: string, colour2: string, ratio: number): string {
        ratio = MathExtra.clamp(ratio, { min: 0, max: 1 });
        const r1 = parseInt(colour1.slice(1, 3), 16);
        const g1 = parseInt(colour1.slice(3, 5), 16);
        const b1 = parseInt(colour1.slice(5, 7), 16);
        const r2 = parseInt(colour2.slice(1, 3), 16);
        const g2 = parseInt(colour2.slice(3, 5), 16);
        const b2 = parseInt(colour2.slice(5, 7), 16);
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}

/* -------------------------------------------------------------------------- */

type Circle = { x: number, y: number, r: number };
type Rectangle = { x: number, y: number, w2: number, h2: number };
/**
 * A utility class providing additional mathematical functions.
 */
export class MathExtra {
    /**
     * Clamps a number between a minimum and maximum value.
     *
     * @param value - The number to clamp.
     * @param options - An object containing the minimum and maximum values.
     * @param options.min - The minimum value. Defaults to -Infinity.
     * @param options.max - The maximum value. Defaults to Infinity.
     * @returns The clamped value.
     */
    public static clamp(value: number, options: { min: number | undefined, max: number | undefined }): number {
        return Math.min(Math.max(value, options.min ?? -Infinity), options.max ?? Infinity);
    }

    /**
     * Calculates the average of the given numbers.
     *
     * @param values - A list of numbers to calculate the average from.
     * @returns The average of the provided numbers.
     */
    public static average(...values: number[]): number {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    /**
     * Linearly interpolates a value between given pin values based on an input pin.
     *
     * @param inputPin - The pin number for which the value needs to be interpolated.
     * @param pinValues - An array of objects containing pin numbers and their corresponding values.
     * @returns The interpolated value for the input pin.
     *
     * @throws Will throw an error if interpolation fails.
     *
     * @example
     * ```typescript
     * const pinValues = [
     *   { pin: 1, value: 10 },
     *   { pin: 3, value: 30 },
     *   { pin: 2, value: 20 }
     * ];
     * const result = Helper.interpolateBetweenPins(2.5, pinValues); // 25
     * ```
     */
    public static interpolateBetweenPins(inputPin: number, pinValues: { pin: number, value: number }[]): number {
        // linearly interpolate between pins
        if (pinValues.length === 0) { return NaN; }
        if (pinValues.length === 1) { return pinValues[0].value; }

        const sortedPinValues = pinValues.sort((a, b) => a.pin - b.pin);
        if (inputPin <= sortedPinValues[0].pin) { return sortedPinValues[0].value; }
        if (inputPin >= sortedPinValues[sortedPinValues.length - 1].pin) { return sortedPinValues[sortedPinValues.length - 1].value; }

        for (let i = 0; i < sortedPinValues.length - 1; i++) {
            const pinA = sortedPinValues[i];
            const pinB = sortedPinValues[i + 1];
            if (inputPin >= pinA.pin && inputPin <= pinB.pin) {
                const ratio = (inputPin - pinA.pin) / (pinB.pin - pinA.pin);
                return pinA.value + ratio * (pinB.value - pinA.value);
            }
        }

        throw new Error(`[Helper][interpolateBetweenPins] Failed to interpolate ${inputPin} between ${JSON.stringify(sortedPinValues, null, 1)}`);
    }

    /**
     * Converts Cartesian coordinates (x, y) to polar coordinates.
     *
     * @param x - The x-coordinate in Cartesian coordinates.
     * @param y - The y-coordinate in Cartesian coordinates.
     * @returns An object containing the polar coordinates:
     *   - `degrees`: The angle in degrees from the positive x-axis; anti-clockwise.
     *   - `distance`: The distance from the origin to the point (x, y).
     */
    public static xyToPolar(x: number, y: number) {
        const degrees = Math.atan2(y, x) * 180 / Math.PI;
        const distance = Math.sqrt(x ** 2 + y ** 2);
        return { degrees, distance };
    }

    /**
     * Converts Cartesian coordinates (x, y) to polar coordinates (degrees, distance) 
     * relative to a clock face where 0 degrees is at the 12 o'clock position.
     *
     * @param x - The x-coordinate in Cartesian space.
     * @param y - The y-coordinate in Cartesian space.
     * @returns An object containing:
     *   - `degrees`: The angle in degrees, where 0 degrees is at the 12 o'clock position; clockwise.
     *   - `distance`: The distance from the origin to the point (x, y).
     */
    public static xyToClockPolar(x: number, y: number) {
        const { degrees, distance } = MathExtra.xyToPolar(x, y);
        return { degrees: -degrees + 90, distance };
    }

    /**
     * Converts polar coordinates (angle in degrees and distance) to Cartesian coordinates (x, y).
     *
     * @param degrees - The angle in degrees, where 0 degrees is along the positive x-axis; anti-clockwise.
     * @param distance - The distance from the origin.
     * @returns An object containing the x and y coordinates.
     */
    public static polarToXY(degrees: number, distance: number) {
        const radians = (degrees * Math.PI) / 180;
        const x = distance * Math.cos(radians);
        const y = distance * Math.sin(radians);
        return { x, y };
    }

    /**
     * Converts clock-based polar coordinates to Cartesian coordinates.
     *
     * @param degrees - The angle in degrees, where 0 degrees points to 12 o'clock; clockwise.
     * @param distance - The distance from the origin.
     * @returns An object containing the Cartesian coordinates { x, y }.
     */
    public static clockPolarToXY(degrees: number, distance: number) {
        const { x, y } = MathExtra.polarToXY(-degrees + 90, distance);
        return { x, y };
    }

    /**
     * Determines if a circle collides with a rectangle.
     *
     * @param circle - The circle object with properties `x`, `y`, and `r` (radius).
     * @param rect - The rectangle object with properties `x`, `y`, `w2` (width/2), and `h2` (height/2).
     * @param tolerance - The tolerance value to use when checking for collision. Positive values favour collision; negative values favour non-collision.
     * @returns `true` if the circle collides with the rectangle, otherwise `false`.
     */
    public static circleRectangleCollide(circle: Circle, rect: Rectangle, tolerance: number): boolean {
        circle.r += tolerance;

        const dx = Math.abs(circle.x - rect.x);
        const dy = Math.abs(circle.y - rect.y);

        if (dx > rect.w2 + circle.r) { return false; }
        if (dy > rect.h2 + circle.r) { return false; }
        if (dx <= rect.w2) { return true; }
        if (dy <= rect.h2) { return true; }

        return (dx - rect.w2) ** 2 + (dy - rect.h2) ** 2 <= (circle.r) ** 2;
    }

    /**
     * Determines if two rectangles collide with each other, considering a tolerance value.
     *
     * @param rect1 - The first rectangle to check for collision.
     * @param rect2 - The second rectangle to check for collision.
     * @param tolerance - The tolerance value to be added to the width and height of the first rectangle. Positive values favour collision; negative values favour non-collision.
     * @returns `true` if the rectangles collide, `false` otherwise.
     */
    public static rectangleRectangleCollide(rect1: Rectangle, rect2: Rectangle, tolerance: number): boolean {
        rect1.w2 += tolerance;
        rect1.h2 += tolerance;

        return Math.abs(rect1.x - rect2.x) < rect1.w2 + rect2.w2 && Math.abs(rect1.y - rect2.y) < rect1.h2 + rect2.h2;
    }

    /**
     * Calculates the angular distance between two angles.
     * 
     * The angular distance is the smallest angle between two points on a circle,
     * measured in degrees. This function ensures that the distance is always
     * between 0 and 180 degrees.
     * 
     * @param a - The first angle in degrees.
     * @param b - The second angle in degrees.
     * @returns The angular distance between the two angles in degrees.
     */
    public static getAngularDistance(a: number, b: number) {
        const diff = Math.abs(a - b);
        return diff > 180 ? 360 - diff : diff;
    }
}

/* -------------------------------------------------------------------------- */

import { Coordinates } from '@/constants/BusData';
/**
 * A utility class for performing location-based operations such as determining
 * if a point is within a polygon, calculating distances, and finding regions or
 * stations based on GPS coordinates.
 */
export class LocationExtra {
    /**
     * Determines whether a given point is inside a polygon.
     *
     * This method uses the ray-casting algorithm to check if the point lies within the boundaries
     * of the polygon. The polygon is defined as an array of coordinates, where each coordinate
     * represents a vertex of the polygon.
     *
     * @param point - The point to check, represented as an object with `latitude` and `longitude` properties.
     * @param polygon - An array of coordinates representing the vertices of the polygon. Each coordinate
     *                  is an object with `latitude` and `longitude` properties.
     * @returns `true` if the point is inside the polygon, otherwise `false`.
     */
    public static pointIsInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
        if (polygon.length === 0) return false;

        const { latitude: lat, longitude: lng } = point;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const { latitude: latI, longitude: lngI } = polygon[i];
            const { latitude: latJ, longitude: lngJ } = polygon[j];

            const intersect = ((lngI > lng) !== (lngJ > lng)) &&
                (lat < (latJ - latI) * (lng - lngI) / (lngJ - lngI) + latI);
            if (intersect) { inside = !inside; }
        }
        return inside;
    }

    /**
     * Calculates the Haversine distance between two geographical points
     * specified by their latitude and longitude in decimal degrees.
     *
     * The Haversine formula determines the great-circle distance between
     * two points on a sphere given their longitudes and latitudes. This
     * is useful for calculating distances between points on the Earth's surface.
     *
     * @param lat1 - Latitude of the first point in decimal degrees.
     * @param lon1 - Longitude of the first point in decimal degrees.
     * @param lat2 - Latitude of the second point in decimal degrees.
     * @param lon2 - Longitude of the second point in decimal degrees.
     * @returns The distance between the two points in meters.
     */
    public static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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
}

/* -------------------------------------------------------------------------- */

import IoniconsGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json';
import MaterialCommunityIconsGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
type IoniconsGlyphs = keyof typeof IoniconsGlyphMap;
type MaterialCommunityIconsGlyphs = keyof typeof MaterialCommunityIconsGlyphMap;
export type IconGlyphsType = IoniconsGlyphs | MaterialCommunityIconsGlyphs;
export class IconGlyphs {
    static Ionicons = Object.keys(IoniconsGlyphMap) as IoniconsGlyphs[];
    static MaterialCommunityIcons = Object.keys(MaterialCommunityIconsGlyphMap) as MaterialCommunityIconsGlyphs[];

    /**
     * Checks if the given icon name is a valid Ionicons glyph.
     *
     * @param name - The name of the icon to check.
     * @returns A boolean indicating whether the name is a valid Ionicons glyph.
     */
    static isIonicons(name: string): name is IoniconsGlyphs { return name in IoniconsGlyphMap; }
    /**
     * Checks if the given icon name is a valid Material Community Icons glyph.
     *
     * @param name - The name of the icon to check.
     * @returns A boolean indicating whether the name is a valid Material Community Icons glyph.
     */
    static isMaterialCommunityIcons(name: string): name is MaterialCommunityIconsGlyphs { return name in MaterialCommunityIconsGlyphMap; }
}

/* -------------------------------------------------------------------------- */

/**
 * Converts an array of minutes and seconds into a time string.
 *
 * @param param0 - An array containing two numbers: the first is the number of minutes, and the second is the number of seconds.
 * @param padFront - An optional boolean that, if true, will pad the front of the time string with zeros.
 * @returns A string representing the time in "MM:SS" format.
 */
export function toTimeString([minutes, seconds]: [number, number], padFront?: boolean): string;
/**
 * Converts a total number of seconds into a time string in the format "HH:MM:SS".
 *
 * @param totalSeconds - The total number of seconds to convert.
 * @param padFront - Optional. If true, pads the front of the time string with zeros to ensure it is always in the format "HH:MM:SS".
 * @returns The formatted time string.
 */
export function toTimeString(totalSeconds: number, padFront?: boolean): string;
export function toTimeString(input: number | [number, number], padFront: boolean = false): string {
    let min: number;
    let sec: number;
    let isNegative = false;

    if (Array.isArray(input)) {
        isNegative = input[0] < 0 || input[1] < 0;
        min = Math.abs(input[0]);
        sec = Math.abs(input[1]);
    } else {
        isNegative = input < 0;
        min = Math.floor(Math.abs(input) / 60);
        sec = Math.abs(input) % 60;
    }

    return `${isNegative ? '-' : ''}${padFront ? min.toString().padStart(2, '0') : min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Calculates the countdown in seconds between the current time and the estimated time of arrival (ETA).
 *
 * @param currentTime - The current date and time.
 * @param etaTime - The estimated date and time of arrival.
 * @returns The countdown in seconds as a number.
 */
export function getCountdown(currentTime: Date, etaTime: Date): number {
    const totalSeconds = (etaTime.getTime() - currentTime.getTime()) / 1000;
    return totalSeconds;
}

/* -------------------------------------------------------------------------- */
/**
 * Extends the global Date interface with additional methods.
 */
declare global {
    interface Date {
        /**
         * Adds the specified amount of time to the current date.
         * 
         * @param years - The number of years to add. Defaults to 0.
         * @param months - The number of months to add. Defaults to 0.
         * @param days - The number of days to add. Defaults to 0.
         * @param hours - The number of hours to add. Defaults to 0.
         * @param minutes - The number of minutes to add. Defaults to 0.
         * @param seconds - The number of seconds to add. Defaults to 0.
         * @param milliseconds - The number of milliseconds to add. Defaults to 0.
         * @returns The updated Date object.
         */
        add(
            { years, months, days, hours, minutes, seconds, milliseconds }: {
                years?: number,
                months?: number,
                days?: number,
                hours?: number,
                minutes?: number,
                seconds?: number,
                milliseconds?: number,
            }
        ): Date;

        /**
         * Truncates the current date to the specified unit.
         * Truncating to 'millisecond' is a null operation.
         * @warning This method mutates the original Date object.
         * 
         * @param unit - The unit to truncate to (e.g., 'year', 'month', 'day', etc.).
         * @returns The truncated Date object.
         */
        truncateTo(
            unit: DateUnits,
        ): Date;
    }
}
Date.prototype.add = function (this: Date,
    { years, months, days, hours, minutes, seconds, milliseconds }: {
        years?: number,
        months?: number,
        days?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        milliseconds?: number,
    }
): Date {
    years = years ?? 0;
    months = months ?? 0;
    days = days ?? 0;
    hours = hours ?? 0;
    minutes = minutes ?? 0;
    seconds = seconds ?? 0;
    milliseconds = milliseconds ?? 0;
    return new Date(this.getTime() + (years * 31536000000) + (months * 2592000000) + (days * 86400000) + (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + (milliseconds));
};
type DateUnits = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
Date.prototype.truncateTo = function (this: Date, unit: DateUnits): Date {
    switch (unit) {
        case 'year':
            this.setMonth(0, 1);
            break;
        case 'month':
            this.setDate(1);
            break;
        case 'day':
            this.setHours(0, 0, 0, 0);
            break;
        case 'hour':
            this.setMinutes(0, 0, 0);
            break
        case 'minute':
            this.setSeconds(0, 0);
            break;
        case 'second':
            this.setMilliseconds(0);
            break;
        case 'millisecond':
            console.warn('[Helper][truncateTo] Date.prototype.truncateTo("millisecond") is a null operation.');
            break;
    }
    return this;
}

/* -------------------------------------------------------------------------- */
/**
 * Extends the global string interface with additional methods.
 */
declare global {
    interface String {
        /**
         * Extends the String interface to include a method that converts the string to title case.
         * 
         * @returns {string} A new string where the first letter of each word is capitalized.
         * 
         * @example
         * ```typescript
         * const string = 'camelCaseString'.toTitleString(); // 'Camel Case String'
         * ```
         */
        toTitleString(): string;
    }
}
String.prototype.toTitleString = function (this: string): string {
    const s = this.replace(/([A-Z])/g, ' $1').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
}