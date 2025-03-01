// const theme = useColourScheme() ?? 'light';
const theme = 'dark';

export const ThemeColours = {
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
    }
}[theme];