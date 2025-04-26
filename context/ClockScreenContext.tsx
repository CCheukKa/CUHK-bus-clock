import { EtaInfo } from '@/utils/Bus';
import { createContext, useContext, useState, ReactNode } from 'react';

type ClockScreenContext = {
    scrollTargetEtaInfo: EtaInfo | null;
    setScrollTargetEtaInfo: React.Dispatch<React.SetStateAction<EtaInfo | null>>;
};

const ClockScreenContext = createContext<ClockScreenContext | undefined>(undefined);

export const ClockScreenContextProvider = ({ children }: { children?: ReactNode }) => {
    const [scrollTargetEtaInfo, setScrollTargetEtaInfo] = useState<EtaInfo | null>(null);

    return (
        <ClockScreenContext.Provider value={{ scrollTargetEtaInfo, setScrollTargetEtaInfo }} >
            {children}
        </ClockScreenContext.Provider>
    );
};

export const useClockScreenContext = () => {
    const context = useContext(ClockScreenContext);
    if (!context) {
        throw new Error('[ThemeContext][useClockScreenContext] useClockScreenContext() must be used within a ClockScreenContextProvider');
    }
    return context;
};