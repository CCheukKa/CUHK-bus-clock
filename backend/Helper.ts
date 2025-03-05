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

/**
 * A utility class providing additional mathematical functions.
 */
export class MathExtra {
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
     * const result = Helper.interpolateBetweenPins(2.5, pinValues);
     * console.log(result); // Output will be 25
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

        throw new Error(`interpolateBetweenPins() failed to interpolate ${inputPin} between ${JSON.stringify(sortedPinValues, null, 1)}`);
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
 * Converts a tuple of two numbers into a formatted time string.
 *
 * @param param0 - A tuple containing two numbers. The first number represents hours/minutes, and the second number represents minutes/seconds.
 * @param padFront - A boolean indicating whether to pad the first number with a leading zero if it is a single digit. Defaults to `false`.
 * @returns A string representing the formatted time.
 * 
 * @example
 * ```typescript
 * const time = toTimeString([1, 30], true);
 * console.log(time); // Output will be '01:30'
 * ```
 */
export function toTimeString([a, b]: [number, number], padFront: boolean = false): string {
    return `${padFront ? a.toString().padStart(2, '0') : a}:${Math.abs(b).toString().padStart(2, '0')}`;
}

/**
 * Calculates the countdown from the current time to the estimated time of arrival (ETA).
 *
 * @param currentTime - The current time as a Date object.
 * @param etaTime - The estimated time of arrival as a Date object.
 * @returns An object containing the ETA in total seconds, minutes, and seconds.
 * @property totalSeconds - The total ETA in seconds.
 * @property totalMinutes - The total ETA in minutes.
 * @property minutes - The ETA in minutes.
 * @property seconds - The remaining seconds after calculating minutes.
 */
export function getCountdown(currentTime: Date, etaTime: Date): { totalMinutes: number, totalSeconds: number, minutes: number, seconds: number } {
    const totalSeconds = (etaTime.getTime() - currentTime.getTime()) / 1000;
    const totalMinutes = totalSeconds / 60;
    const sign = Math.sign(totalSeconds);
    const minutes = Math.floor(Math.abs(totalSeconds) / 60) * sign;
    const seconds = Math.floor(Math.abs(totalSeconds) % 60) * sign;
    return { totalMinutes, totalSeconds, minutes, seconds };
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
            console.warn('Date.prototype.truncateTo("millisecond") is a null operation.');
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
         * const string = 'camelCaseString'.toTitleString();
         * console.log(string); // Output will be 'Camel Case String'
         * ```
         */
        toTitleString(): string;
    }
}
String.prototype.toTitleString = function (this: string): string {
    const s = this.replace(/([A-Z])/g, ' $1').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
}