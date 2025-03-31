import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, View } from 'react-native';

const TRIANGLE_ANGLE_LIMIT = 90;

type TriangleProps = {
    startDegrees: number;
    angle: number;
    colour: string;
};
function Triangle({ angle, startDegrees, colour }: TriangleProps) {
    if (angle < 0 || angle > TRIANGLE_ANGLE_LIMIT) {
        console.warn(`[ClockArcs][Triangle] Triangle degrees must be between 0 and ${TRIANGLE_ANGLE_LIMIT}, got ${angle}`);
        return null;
    }
    // tan(θ/2) = b/h
    const h = 120;
    const b = Math.tan(angle / 180 * Math.PI / 2) * h;
    const rotation = 180 + angle / 2 + startDegrees;

    return (
        <View
            style={[
                styles.triangle,
                {
                    borderBottomColor: colour,
                    borderLeftWidth: b,
                    borderRightWidth: b,
                    borderBottomWidth: h,
                    transform: [
                        { translateX: '-50%' },
                        { rotate: `${rotation}deg` },
                    ],
                }
            ]}
        />
    );
}

type PieProps = {
    startDegrees: number;
    angle: number;
    colour: string;
};
function Pie({ startDegrees, angle, colour }: PieProps) {
    if (angle < 0) {
        startDegrees += angle;
        angle = -angle;
    }
    if (angle > 360) {
        angle = 360;
    }
    if (angle === 0) {
        return null;
    }

    const triangles: { startDegrees: number, angle: number }[] = [];
    while (angle > TRIANGLE_ANGLE_LIMIT) {
        triangles.push({ startDegrees, angle: TRIANGLE_ANGLE_LIMIT });
        startDegrees += TRIANGLE_ANGLE_LIMIT;
        angle -= TRIANGLE_ANGLE_LIMIT;
    }
    triangles.push({ startDegrees, angle });
    return (
        <>
            {triangles.map((triangle, index) => (
                <Triangle key={index} startDegrees={triangle.startDegrees} angle={triangle.angle} colour={colour} />
            ))}
        </>
    );
}

type ClockArcsProps = {
    time: Date;
};
export function ClockArcs({ time }: ClockArcsProps) {
    const { theme } = useTheme();
    const { settings } = useSettings();

    const currentDegrees = 360 / 60 * time.getMinutes() + 360 / 60 / 60 * time.getSeconds();
    const pastAngle = 360 / 60 * settings.pastPeekMinutes;
    const futureAngle = 360 / 60 * settings.futurePeekMinutes;
    return (
        <View style={styles.clockArcContainer}>
            <Pie startDegrees={currentDegrees} angle={-pastAngle} colour={theme.primary} />
            <Pie startDegrees={currentDegrees} angle={futureAngle} colour={theme.secondaryHeavy} />
            <View style={[
                styles.innerCircle,
                { backgroundColor: theme.background }
            ]} />
        </View>
    );
}

const styles = StyleSheet.create({
    clockArcContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 1.02 }],
    },
    innerCircle: {
        position: 'absolute',
        width: '98%',
        height: '98%',
        borderRadius: '50%',
        backgroundColor: 'blue',
    },
    triangle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: 'top center',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
});