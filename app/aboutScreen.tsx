import { FullscreenView } from '@/components/common/FullscreenView';
import { ThemedText } from '@/components/common/ThemedText';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { FontSizes } from '@/utils/Typography';
import { useTheme } from '@/context/ThemeContext';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';

export default function InfoScreen() {
    const { theme } = useTheme();

    const appVersion = Constants.expoConfig?.version || '1.0.0';

    return (
        <FullscreenView>
            <View style={styles.infoContainer}>
                <Image
                    style={styles.appLogo}
                    source={require('@/assets/images/icon.png')}
                />
                <ThemedText type='subtitle'>CUHK Bus Clock</ThemedText>
                <ThemedText type='default'>{`v${appVersion}`}</ThemedText>
                <ThemedText
                    type='default'
                    style={styles.descriptionText}
                >
                    Based on the 2025 CUHK bus schedule.
                </ThemedText>
                <ThemedText
                    type='default'
                    style={styles.descriptionText}
                >
                    This is a personal project by CCheukKa.
                    It is not affiliated with CUHK.
                    All information used in this app is either publicly available or collected by me.
                </ThemedText>
                <ThemedText
                    type='default'
                    style={styles.descriptionText}
                >
                    Data points were collected manually and averaged to generate a time sheet.
                    Please expect inaccuracies and variations from real-world conditions.
                </ThemedText>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonsRowContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.minimalContrast },
                        ]}
                        onPress={() => {
                            Linking.openURL('https://github.com/CCheukKa');
                        }}
                    >
                        <MaterialCommunityIcons
                            name='human-greeting-variant'
                            size={22}
                            color={theme.text}
                        />
                        <ThemedText type='defaultSemiBold'>
                            View Developer
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.minimalContrast },
                        ]}
                        onPress={() => {
                            Linking.openURL('https://github.com/CCheukKa/CUHK-bus-clock');
                        }}
                    >
                        <FontAwesome6
                            name='code'
                            size={20}
                            color={theme.text}
                        />
                        <ThemedText type='defaultSemiBold'>
                            View Source
                        </ThemedText>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsRowContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.dimContrast },
                        ]}
                        onPress={() => {
                            Linking.openURL('https://github.com/CCheukKa/CUHK-bus-clock/issues/new?template=bug_report.md');
                        }}
                    >
                        <MaterialCommunityIcons
                            name='bug'
                            size={26}
                            color={theme.text}
                        />
                        <ThemedText type='defaultSemiBold'>
                            Report Bug
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.dimContrast },
                        ]}
                        onPress={() => {
                            Linking.openURL('https://github.com/CCheukKa/CUHK-bus-clock/issues/new?template=feature_request.md');
                        }}
                    >
                        <MaterialCommunityIcons
                            name='lightbulb-on'
                            size={26}
                            color={theme.text}
                        />
                        <ThemedText type='defaultSemiBold'>
                            Feature Request
                        </ThemedText>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsRowContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: theme.secondarySharp },
                        ]}
                        onPress={() => {
                            Linking.openURL('https://buymeacoffee.com/ccheukka');
                        }}
                    >
                        <MaterialCommunityIcons
                            name='hand-heart'
                            size={26}
                            color={theme.text}
                        />
                        <ThemedText type='defaultSemiBold'>
                            Support Me
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </FullscreenView>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        flex: 1,
        width: '70%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appLogo: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    descriptionText: {
        marginVertical: 16,
        lineHeight: FontSizes.large,
        textAlign: 'justify',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginBottom: 12,
    },
    buttonsRowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 8,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
});