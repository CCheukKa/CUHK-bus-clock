import { ThemeName } from "@/constants/Themes";

/* -------------------------------------------------------------------------- */
export type Settings = {
    theme: ThemeName;
    pastPeekMinutes: number;
    futurePeekMinutes: number;
    showClockFace: boolean;
    showCountdown: boolean;
    timingShowMinutes: number;
    useModalLocationPicker: boolean;
};
export const settingsSchema: Record<keyof Settings, {
    type: 'enum' | 'number' | 'nonNegativeNumber' | 'boolean';
    enumValues?: any[];
    description: string;
    defaultValue: any;
    disabled?: boolean;
}> = {
    theme: {
        type: 'enum',
        enumValues: Object.values(ThemeName),
        description: 'Colour theme of the app',
        defaultValue: ThemeName.DARK,
        disabled: true,
    },
    pastPeekMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes in the past to show bubbles',
        defaultValue: 10,
    },
    futurePeekMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes in the future to show bubbles',
        defaultValue: 30,
    },
    showClockFace: {
        type: 'boolean',
        description: 'Show clock face',
        defaultValue: true,
    },
    showCountdown: {
        type: 'boolean',
        description: 'Show countdown instead of ETA on clock',
        defaultValue: true,
    },
    timingShowMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes within to show timings',
        defaultValue: 10,
    },
    useModalLocationPicker: {
        type: 'boolean',
        description: 'Use fullscreen modal for location picker',
        defaultValue: false,
    },
};

export function getDefaultSettings(): Settings {
    return Object.fromEntries(
        Object.entries(settingsSchema)
            .map(([key, { defaultValue }]) => [key, defaultValue])
    ) as Settings;
}