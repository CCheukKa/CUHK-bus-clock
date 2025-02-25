//? This is a workaround for the initialRouteName not working

import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/clock');
        }, 0);

        return () => clearTimeout(timer);
    }, [router]);

    return null;
}