import React from "react";
import { View, ViewProps } from "react-native";

export type StrokeWrapperProps = ViewProps & {
    strokeWidth: number;
    cloneCount?: number;
};

export function StrokeWrapper({
    strokeWidth,
    cloneCount = 8,
    children,
    ...otherProps
}: StrokeWrapperProps) {
    if (React.Children.count(children) !== 1) {
        console.warn(`[StrokeWrapper] Expected 1 child, but got ${React.Children.count(children)}`);
        return children;
    }
    if (strokeWidth <= 0) {
        console.warn(`[StrokeWrapper] Expected strokeWidth > 0, but got ${strokeWidth}`);
        return children;
    }
    if (cloneCount < 4) {
        console.warn(`[StrokeWrapper] Expected cloneCount ≥ 4, but got ${cloneCount}`);
        return children;
    }
    /* -------------------------------------------------------------------------- */

    const angles = Array.from({ length: cloneCount }, (_, i) => (i * 360) / cloneCount);
    const offsets = angles.map((angle) => {
        const radian = (angle * Math.PI) / 180;
        return {
            x: -strokeWidth * Math.sin(radian),
            y: strokeWidth * Math.cos(radian),
        };
    });

    const childElement = React.Children.only(children) as React.ReactElement;
    const outlineClones = offsets.map(offset =>
        React.cloneElement(
            childElement,
            {
                key: `stroke-${offset.x}-${offset.y}`,
                style: [
                    {
                        position: 'absolute',
                        transform: [
                            { translateX: offset.x },
                            { translateY: offset.y },
                        ],
                    },
                    childElement.props.style,
                ]
            }
        )
    );

    return (<View {...otherProps}>
        {children}
        {outlineClones}
    </View>);
}