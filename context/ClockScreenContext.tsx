import { createContext, useContext, useState, ReactNode } from 'react';

export type ScrollToEtaInfoParameters = {
    etaInfoId: string,
}

type ClockScreenContext = {
    scrollToEtaInfoParameters: ScrollToEtaInfoParameters | null;
    setScrollToEtaInfoParameters: React.Dispatch<React.SetStateAction<ScrollToEtaInfoParameters | null>>;
};

const ClockScreenContext = createContext<ClockScreenContext | undefined>(undefined);

export const ClockScreenContextProvider = ({ children }: { children?: ReactNode }) => {
    const [scrollToEtaInfoParameters, setScrollToEtaInfoParameters] = useState<ScrollToEtaInfoParameters | null>(null);

    return (
        <ClockScreenContext.Provider value={{ scrollToEtaInfoParameters, setScrollToEtaInfoParameters }} >
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