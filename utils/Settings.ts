import { ThemeName } from "@/constants/Themes";

export enum SuboptimalRouteStyle {
    HIDDEN = 'hide',
    HOLLOW = 'hollow',
    FILLED = 'filled',
};

/* -------------------------------------------------------------------------- */
export type Settings = {
    theme: ThemeName;
    pastPeekMinutes: number;
    futurePeekMinutes: number;
    showClockFace: boolean;
    showPeekArcs: boolean;
    showCountdown: boolean;
    dimDistantInfo: boolean;
    timingShowMinutes: number;
    suboptimalRouteStyle: SuboptimalRouteStyle;
    useFullscreenLocationPicker: boolean;
    bigCountdownInPanel: boolean;
    detectHolidays: boolean;
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
        defaultValue: 5,
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
    showPeekArcs: {
        type: 'boolean',
        description: 'Show arcs for peek times on clock',
        defaultValue: true,
    },
    showCountdown: {
        type: 'boolean',
        description: 'Show countdown instead of ETA on clock',
        defaultValue: true,
    },
    dimDistantInfo: {
        type: 'boolean',
        description: 'Dim distant info on clock',
        defaultValue: true,
    },
    timingShowMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes within which to show timings',
        defaultValue: 10,
    },
    suboptimalRouteStyle: {
        type: 'enum',
        enumValues: Object.values(SuboptimalRouteStyle),
        description: 'Appearance for suboptimal routes',
        defaultValue: SuboptimalRouteStyle.HOLLOW,
    },
    useFullscreenLocationPicker: {
        type: 'boolean',
        description: 'Use fullscreen modal for location picker',
        defaultValue: false,
    },
    bigCountdownInPanel: {
        type: 'boolean',
        description: 'Show big countdown in panel',
        defaultValue: false,
    },
    detectHolidays: {
        type: 'boolean',
        description: 'Fetch holidays from HK gov API',
        defaultValue: true,
    },
};

export function getDefaultSettings(): Settings {
    return Object.fromEntries(
        Object.entries(settingsSchema)
            .map(([key, { defaultValue }]) => [key, defaultValue])
    ) as Settings;
}