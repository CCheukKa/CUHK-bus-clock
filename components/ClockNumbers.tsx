import { ClockThing, ClockThingType } from "@/components/ClockThing";
import { memo } from "react";

function ClockNumbers() {
    return Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
        return (
            <ClockThing type={ClockThingType.CLOCK_NUMBER} key={i} degrees={360 / 12 * i} distance={0.76}>
                {i}
            </ClockThing>
        );
    });
}

export default memo(ClockNumbers);