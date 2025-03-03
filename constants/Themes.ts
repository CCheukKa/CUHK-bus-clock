export enum ThemeName {
    DARK = 'dark',
    LIGHT = 'light',
};

export type Theme = {
    black: string;
    white: string;
    //
    text: string;
    background: string;
    highContrast: string;
    halfContrast: string;
    lowContrast: string;
    dimContrast: string;
    //
    accent: string;
    accentHeavy: string;
};

export const Themes: Record<ThemeName, Theme> = {
    dark: {
        black: '#000000',
        white: '#ffffff',
        //
        text: '#ecedee',
        background: '#151718',
        highContrast: '#ffffff',
        halfContrast: '#a0a0a0',
        lowContrast: '#606060',
        dimContrast: '#404040',
        //
        accent: 'lightpink',
        accentHeavy: 'hotpink',
        // accent: 'lightblue',
        // accentHeavy: 'deepskyblue',
        // accent: 'lightgreen',
        // accentHeavy: 'lightseagreen',
    },
    light: {
        black: '#000000',
        white: '#ffffff',
        //
        text: '#11181C',
        background: '#ffffff',
        highContrast: '#000000',
        halfContrast: '#606060',
        lowContrast: '#a0a0a0',
        dimContrast: '#c0c0c0',
        //
        accent: 'hotpink',
        accentHeavy: 'deeppink',
    },
};