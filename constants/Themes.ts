export const enum ThemeName {
    DARK = 'dark',
    LIGHT = 'light',
}

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
    minimalContrast: string;
    //
    primary: string;
    primaryHeavy: string;
    primarySharp: string;
    secondary: string;
    secondaryHeavy: string;
    secondarySharp: string;
    tertiary: string;
    tertiaryHeavy: string;
    tertiarySharp: string;
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
        minimalContrast: '#202020',
        //
        primary: 'lightpink',
        primaryHeavy: 'hotpink',
        primarySharp: 'deeppink',
        secondary: 'lightblue',
        secondaryHeavy: 'deepskyblue',
        secondarySharp: 'royalblue',
        tertiary: 'lightgreen',
        tertiaryHeavy: 'lightseagreen',
        tertiarySharp: 'seagreen',
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
        minimalContrast: '#e0e0e0',
        //
        primary: 'hotpink',
        primaryHeavy: 'deeppink',
        primarySharp: 'firebrick',
        secondary: 'deepskyblue',
        secondaryHeavy: 'royalblue',
        secondarySharp: 'midnightblue',
        tertiary: 'lightseagreen',
        tertiaryHeavy: 'seagreen',
        tertiarySharp: 'forestgreen',
    },
} as const;