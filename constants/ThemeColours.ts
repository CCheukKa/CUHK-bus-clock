// const theme = useColourScheme() ?? 'light';
const theme = 'dark';

export const ThemeColours = {
    // light: {
    //     text: '#11181C',
    //     background: '#ffffff',
    //     black: '#000000',
    //     tint: '#0a7ea4',
    // },
    dark: {
        black: '#000000',
        white: '#ffffff',
        //
        text: '#ECEDEE',
        background: '#151718',
        highContrast: '#ffffff',
        halfContrast: '#a0a0a0',
        lowContrast: '#606060',
        dimContrast: '#404040',
        // accent: '#0a7ea4',
    }
}[theme];