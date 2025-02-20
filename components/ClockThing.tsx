import { StyleSheet, Text, View, ViewProps } from 'react-native';

export enum ClockThingType {
    CLOCK_NUMBER = 'clockNumber',
};

/**
 * ClockThing component renders a circular clock element at a specified position.
 * 
 * @param {ClockThingType} [props.type] - The type of the clock thing.
 * @param {number} props.x - The [-1,1] x-coordinate of the clock thing.
 * @param {number} props.y - The [-1,1] y-coordinate of the clock thing.
 * @param {number} [props.degrees] - The angle in degrees of the clock thing. (0 is 12 o'clock; clockwise)
 * @param {number} [props.length] - The length from the center of the clock thing.
 */
export type ClockThingProps = {
    type?: ClockThingType;
} & (
        { x: number; y: number; degrees: never; length: never } |
        { degrees: number; length: number; x?: never; y?: never }
    ) & ViewProps;


export function ClockThing({ type, x, y, degrees, length, ...otherProps }: ClockThingProps) {

    let left: number, top: number;

    if (degrees !== undefined && length !== undefined) {
        const radians = ((-degrees + 90) * Math.PI) / 180;
        left = 50 + length * Math.cos(radians) * 50;
        top = 50 - length * Math.sin(radians) * 50;
    } else if (x !== undefined && y !== undefined) {
        left = 50 + x * 50;
        top = 50 - y * 50;
    } else {
        left = 50;
        top = 50;
    }

    const contentWithin = (() => {
        const children = otherProps.children;
        switch (type) {
            case ClockThingType.CLOCK_NUMBER:
                return (<Text style={styles.clockNumber}>{children}</Text>);
            default:
                return children;
        }
    })();

    return (
        <View style={[
            styles.clockThing,
            { left: `${left}%`, top: `${top}%` }
        ]} {...otherProps}>
            {contentWithin}
        </View>
    );
}

const styles = StyleSheet.create({
    clockThing: {
        color: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '10%',
        aspectRatio: 1,
        borderRadius: '50%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
    },
    clockNumber: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
});