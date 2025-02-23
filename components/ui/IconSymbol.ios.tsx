import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
    name,
    size = 24,
    colour: colour,
    style,
    weight = 'regular',
}: {
    name: SymbolViewProps['name'];
    size?: number;
    colour: string;
    style?: StyleProp<ViewStyle>;
    weight?: SymbolWeight;
}) {
    return (
        <SymbolView
            weight={weight}
            tintColor={colour}
            resizeMode="scaleAspectFit"
            name={name}
            style={[
                {
                    width: size,
                    height: size,
                },
                style,
            ]}
        />
    );
}
