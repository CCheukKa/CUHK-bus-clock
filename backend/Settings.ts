import { ThemeName } from "@/constants/Themes";

/* -------------------------------------------------------------------------- */
export type Settings = {
    theme: ThemeName;
    pastPeekMinutes: number;
    futurePeekMinutes: number;
};
export const settingsSchema: Record<keyof Settings, {
    type: 'enum' | 'number' | 'nonNegativeNumber';
    enumValues?: any[];
    description: string;
    defaultValue: any;
}> = {
    theme: {
        type: 'enum',
        enumValues: Object.values(ThemeName),
        description: 'Colour theme of the app',
        defaultValue: ThemeName.DARK,
    },
    pastPeekMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes in the past to show ETAs',
        defaultValue: 10,
    },
    futurePeekMinutes: {
        type: 'nonNegativeNumber',
        description: 'Minutes in the future to show ETAs',
        defaultValue: 30,
    }
};

export function getDefaultSettings(): Settings {
    return Object.fromEntries(
        Object.entries(settingsSchema)
            .map(([key, { defaultValue }]) => [key, defaultValue])
    ) as Settings;
}