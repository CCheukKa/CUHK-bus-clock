import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDefaultSettings, Settings } from '@/utils/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'settings';
function saveSettings(settings: Settings) {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
        .then(() => console.log('[Settings][saveSettings] Settings saved'))
        .catch(error => console.error(error));
}
async function getSavedSettings(): Promise<Settings> {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY)
        .then(value => JSON.parse(value || '{}'))
        .catch(error => console.error(error));
    const defaultSettings = getDefaultSettings();
    return { ...defaultSettings, ...settings } as Settings;
}

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(getDefaultSettings());

    useEffect(() => {
        getSavedSettings().then(settings => {
            setSettings(settings);
            console.log('[SettingsProvider][fetchSavedSettings] Settings fetched');
        });
    }, []);

    useEffect(() => { saveSettings(settings) }, [settings]);

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