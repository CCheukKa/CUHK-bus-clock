import { ThemeColours } from "@/constants/ThemeColours";
import { StyleSheet, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function FullscreenView({ children }: ViewProps) {
    return (
        <SafeAreaView style={styles.fullscreenView}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullscreenView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ThemeColours.background,
    },
});