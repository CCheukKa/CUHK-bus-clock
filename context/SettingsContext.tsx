import { createContext, useContext, useState, ReactNode } from 'react';
import { getDefaultSettings, Settings } from '@/backend/Settings';

type SettingsContextType = {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(getDefaultSettings());

    return (
        <SettingsContext.Provider value={{ settings, setSettings }} >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('[SettingsContext][useSettings] useSettings() must be used within a SettingsProvider');
    }
    return context;
};