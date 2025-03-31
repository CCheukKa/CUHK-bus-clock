import { getDefaultSettings, Settings, settingsSchema } from '@/utils/Settings';
import { FullscreenView } from '@/components/common/FullscreenView';
import { ThemedText } from '@/components/common/ThemedText';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dialog, Portal, Switch, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

DropDownPicker.setTheme('DARK');

export default function SettingsScreen() {
    const { theme } = useTheme();
    const { setSettings } = useSettings();
    const [resetDialogVisible, setResetDialogVisible] = useState(false);

    const resetSettings = () => {
        setSettings(getDefaultSettings());
        console.log('[SettingsScreen][resetSettings] Settings reset to default');
        setResetDialogVisible(false);
    };

    return (
        <FullscreenView>
            <ScrollView
                style={styles.settingsScrollview}
                contentContainerStyle={styles.settingsScrollviewContainer}
            >
                <Controls />
            </ScrollView>
            <TouchableOpacity
                style={styles.resetToDefaultButtonContainer}
                onPress={() => setResetDialogVisible(true)}
            >
                <View style={[
                    styles.resetToDefaultButton,
                    { backgroundColor: theme.dimContrast },
                ]}>
                    <MaterialCommunityIcons
                        name='arrow-u-left-top-bold'
                        size={28}
                        color={theme.highContrast}
                    />
                    <ThemedText type='subtitle'> Reset all to default settings </ThemedText>
                </View>
            </TouchableOpacity>
            <ResetSettingsDialog />
        </FullscreenView>
    );
    /* -------------------------------------------------------------------------- */

    function ResetSettingsDialog() {
        return (
            <Portal>
                <SettingsProvider>
                    <ThemeProvider>
                        <Dialog
                            visible={resetDialogVisible}
                            onDismiss={() => setResetDialogVisible(false)}
                            style={{
                                backgroundColor: theme.minimalContrast,
                                shadowColor: theme.halfContrast,
                                borderColor: theme.lowContrast,
                                borderWidth: 0.5,
                            }}
                            theme={{ colors: { backdrop: `${theme.background}e0` } }}
                        >
                            <Dialog.Title style={{ color: theme.text, fontWeight: 'bold' }}>Reset Settings</Dialog.Title>
                            <Dialog.Content>
                                <ThemedText>
                                    Do you want to reset all settings to their default values? This action cannot be undone.
                                </ThemedText>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <TouchableOpacity onPress={() => setResetDialogVisible(false)}>
                                    <ThemedText style={{ padding: 8, color: theme.highContrast }}>
                                        Cancel
                                    </ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={resetSettings}>
                                    <ThemedText style={{ padding: 8, marginLeft: 8, color: theme.primary, fontWeight: 'bold' }}>
                                        Reset
                                    </ThemedText>
                                </TouchableOpacity>
                            </Dialog.Actions>
                        </Dialog>
                    </ThemeProvider>
                </SettingsProvider>
            </Portal>
        );
    }
}

function Controls() {
    const { settings, setSettings } = useSettings();
    const { theme } = useTheme();

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
                                style={[
                                    styles.control,
                                    {
                                        backgroundColor: schema.disabled ? theme.background : theme.minimalContrast,
                                        opacity: schema.disabled ? 0.4 : 1,
                                    },
                                ]}
                                dropDownContainerStyle={{ backgroundColor: theme.minimalContrast }}
                                disabled={schema.disabled}
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
                                    let inputValue = Number(value);
                                    if (isNaN(inputValue)) { inputValue = 0; }
                                    if (schema.type === 'nonNegativeNumber' && !(inputValue >= 0)) { inputValue = 0; }
                                    setSettings({ ...settings, [key]: inputValue })
                                    setValue(inputValue.toString());
                                }}
                                contentStyle={{ textAlign: 'right' }}
                                style={[
                                    styles.control,
                                    { backgroundColor: theme.minimalContrast }
                                ]}
                                outlineStyle={[styles.control]}
                            />);
                        }
                    case 'boolean':
                        {
                            return (<Switch
                                value={settings[key] as boolean}
                                onValueChange={() => {
                                    setSettings({ ...settings, [key]: !(settings[key] as boolean) });
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

const settingHeight = 24 + 24 + 16;
const styles = StyleSheet.create({
    settingsScrollview: {
        width: '100%',
        height: '90%',
    },
    settingsScrollviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 48,
        gap: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    settingText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    setting: {
        width: '90%',
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
    resetToDefaultButtonContainer: {
        marginVertical: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetToDefaultButton: {
        // width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
});
