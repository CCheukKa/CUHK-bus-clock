import { Settings, settingsSchema } from '@/backend/Settings';
import { FullscreenView } from '@/components/FullscreenView';
import { ThemedText } from '@/components/ThemedText';
import { useSettings } from '@/context/SettingsContext';
import { StyleSheet, View } from 'react-native';
import { Switch, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';

DropDownPicker.setTheme('DARK');

export default function SettingsScreen() {
    return (
        <FullscreenView>
            <View style={styles.settingsContainer}>
                <Controls />
            </View>
        </FullscreenView>
    );
}

function Controls() {
    const { settings, setSettings } = useSettings();

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
                    <ThemedText type='faded'> Default: {String(defaultValue)} </ThemedText>
                </View>
            );

            const control = (() => {
                switch (schema.type) {
                    case 'enum':
                        {
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
                        }
                    case 'number':
                    case 'nonNegativeNumber':
                        {
                            const [value, setValue] = useState(settings[key].toString());
                            return (<TextInput
                                mode='outlined'
                                keyboardType='numeric'
                                outlineColor='transparent'
                                value={value}
                                onChangeText={setValue}
                                onBlur={() => {
                                    console.log('onBlur', value);
                                    let inputValue = Number(value);
                                    if (isNaN(inputValue)) { inputValue = 0; }
                                    if (schema.type === 'nonNegativeNumber' && !(inputValue >= 0)) { inputValue = 0; }
                                    setSettings({ ...settings, [key]: inputValue })
                                    setValue(inputValue.toString());
                                }}
                                contentStyle={{ textAlign: 'right' }}
                                style={[styles.control]}
                                outlineStyle={[styles.control]}
                            />);
                        }
                    case 'boolean':
                        {
                            const [isSwitchOn, setIsSwitchOn] = useState(settings[key] as boolean);

                            return (<Switch
                                value={isSwitchOn}
                                onValueChange={() => {
                                    setSettings({ ...settings, [key]: !isSwitchOn });
                                    setIsSwitchOn(!isSwitchOn);
                                }}
                                style={[styles.control]}
                            />);
                        }
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
