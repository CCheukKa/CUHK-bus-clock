import { useEffect, useState } from 'react';
import { useColorScheme as useRNColourScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColourScheme() {
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const colourScheme = useRNColourScheme();

    if (hasHydrated) {
        return colourScheme;
    }

    return 'light';
}
