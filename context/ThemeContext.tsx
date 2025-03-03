import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Theme, Themes } from '@/constants/Themes';

type ThemeContext = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeContext = createContext<ThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
    const { settings } = useSettings();
    const [theme, setTheme] = useState<Theme>(() => Themes.dark);

    useEffect(() => {
        setTheme(Themes[settings.theme]);
    }, [settings.theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }} >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};