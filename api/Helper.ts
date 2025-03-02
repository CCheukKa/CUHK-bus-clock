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
/**
 * Extends the global Date interface with additional methods.
 */
declare global {
    interface Date {
        /**
         * Adds the specified amount of time to the current date.
         * 
         * @param hours - The number of hours to add. Defaults to 0.
         * @param minutes - The number of minutes to add. Defaults to 0.
         * @param seconds - The number of seconds to add. Defaults to 0.
         * @param milliseconds - The number of milliseconds to add. Defaults to 0.
         * @returns The updated Date object.
         */
        add(
            hours?: number,
            minutes?: number,
            seconds?: number,
            milliseconds?: number,
        ): Date;
    }
}
Date.prototype.add = function (this: Date, hours?, minutes?, seconds?, milliseconds?): Date {
    return new Date(this.getTime() + (hours ?? 0) * 3600000 + (minutes ?? 0) * 60000 + (seconds ?? 0) * 1000 + (milliseconds ?? 0));
};