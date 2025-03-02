import { Settings, settingsSchema, Theme } from '@/backend/Settings';
import { FullscreenView } from '@/components/FullscreenView';
import { ThemedText } from '@/components/ThemedText';
import { useSettings } from '@/context/SettingsContext';
import { StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
    const { settings, setSettings } = useSettings();

    const controls = (() => {
        return (Object.keys(settings) as (keyof Settings)[])
            .map(key => {
                const schema = settingsSchema[key];

                const name = (key as string).toTitleString();
                const description = schema.description;
                const defaultValue = schema.defaultValue;
                const settingText = (
                    <View style={styles.settingText}>
                        <ThemedText type='subtitle'> {name} </ThemedText>
                        <ThemedText type='default'> {description} </ThemedText>
                        <ThemedText type='faded'> Default: {defaultValue} </ThemedText>
                    </View>
                );

                const control = (() => {
                    switch (schema.type) {
                        case 'enum':
                            return (
                                <View>
                                    {schema.enumValues?.map(value => (
                                        <ThemedText key={value}>
                                            {value === settings[key] ? `Selected: ${value}` : value}
                                        </ThemedText>
                                    ))}
                                </View>
                            );
                        case 'number':
                            return <ThemedText>Number</ThemedText>;
                        case 'string':
                            return <ThemedText>String</ThemedText>;
                        case 'boolean':
                            return <ThemedText>Boolean</ThemedText>;
                        default:
                            return <ThemedText>Unknown</ThemedText>;
                    }
                })();

                return (
                    <View style={styles.setting} key={name}>
                        {settingText}
                        {control}
                    </View>
                );
            });
    })();

    return (
        <FullscreenView>
            <View style={styles.settingsContainer}>
                {controls}
            </View>
        </FullscreenView>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        width: '90%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
    },
    settingText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    setting: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
