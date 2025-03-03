import { Settings, settingsSchema, Theme } from '@/backend/Settings';
import { FullscreenView } from '@/components/FullscreenView';
import { ThemedText } from '@/components/ThemedText';
import { useSettings } from '@/context/SettingsContext';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';

DropDownPicker.setTheme('DARK');

export default function SettingsScreen() {
    const { settings, setSettings } = useSettings();

    const controls = (() => {
        console.log(settings);

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
                            const [open, setOpen] = useState(false);
                            const [items, setItems] = useState(schema.enumValues?.map(value => ({ label: String(value).toTitleString(), value })) ?? []);
                            const [value, setValue] = useState(settings[key].toString());
                            useEffect(() => {
                                setSettings({ ...settings, [key]: value })
                            }, [value]);
                            return (<DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={[styles.control]}
                            />);
                        case 'number':
                            return (<TextInput
                                mode='outlined'
                                keyboardType='numeric'
                                outlineColor='transparent'
                                contentStyle={{ textAlign: 'right' }}
                                value={settings[key].toString()}
                                onChangeText={value => setSettings({ ...settings, [key]: Number(value) })}
                                style={[styles.control]}
                                outlineStyle={[styles.control]}
                            />);
                        default:
                            return <ThemedText>Unknown</ThemedText>;
                    }
                })();

                return (
                    <View style={styles.setting} key={name}>
                        {settingText}
                        <View style={styles.controlContainer}>
                            {control}
                        </View>
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

const settingHeight = 24 + 24 + 32;
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
        height: settingHeight,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlContainer: {
        display: 'flex',
        height: '100%',
        width: '25%',
    },
    control: {
        width: '100%',
        height: settingHeight,
        borderRadius: 8,
    },
});
