import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

type ResponsiveContextType = {
    windowWidth: number;
    windowHeight: number;
};

const ResponsiveContext = createContext<ResponsiveContextType>({
    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
});

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
    const [dimensions, setDimensions] = useState({
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height,
    });

    useEffect(() => {
        function handleChange() {
            setDimensions({
                windowWidth: Dimensions.get('window').width,
                windowHeight: Dimensions.get('window').height,
            });
        }

        const subscription = Dimensions.addEventListener('change', handleChange);
        return () => subscription.remove();
    }, []);

    return (
        <ResponsiveContext.Provider value={dimensions}>
            {children}
        </ResponsiveContext.Provider>
    );
}

export const useResponsive = () => useContext(ResponsiveContext);