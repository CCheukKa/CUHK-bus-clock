export class Colour {
    public static getBrightness(hex: string): number {
        // https://www.w3.org/TR/AERT/#color-contrast
        return Math.sqrt(
            0.299 * Math.pow(parseInt(hex.slice(1, 3), 16), 2) +
            0.587 * Math.pow(parseInt(hex.slice(3, 5), 16), 2) +
            0.114 * Math.pow(parseInt(hex.slice(5, 7), 16), 2)
        );
    }
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

type PinValue = {
    pin: number,
    value: number,
};
export class MathExtra {
    public static average(...values: number[]): number {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
    public static interpolateBetweenPins(inputPin: number, pinValues: PinValue[]): number {
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