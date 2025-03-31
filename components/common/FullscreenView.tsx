import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export function FullscreenView({ children }: ViewProps) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[
            styles.fullscreenView,
            { backgroundColor: theme.background },
        ]}>
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
    },
});