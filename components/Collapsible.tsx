import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColourScheme } from '@/hooks/useColourScheme';
import { Colours } from '@/constants/Colours';
import { MaterialIcons } from '@expo/vector-icons';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useColourScheme() ?? 'light';

    return (
        <ThemedView>
            <TouchableOpacity
                style={styles.heading}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}>
                <MaterialIcons
                    name="keyboard-arrow-right"
                    size={18}
                    color={theme === 'light' ? Colours.light.icon : Colours.dark.icon}
                    style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
                />

                <ThemedText type="defaultSemiBold">{title}</ThemedText>
            </TouchableOpacity>
            {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
