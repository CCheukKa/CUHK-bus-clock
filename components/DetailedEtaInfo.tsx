import { EtaInfo } from "@/api/Bus";
import { StyleSheet, View } from "react-native";

type DetailedEtaInfoProps = {
    time: Date;
    etaInfos: EtaInfo[];
};
export function DetailedEtaInfo({ time, etaInfos }: DetailedEtaInfoProps) {
    return (
        <View style={styles.infoContainer}>

        </View>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        width: '90%',
        flex: 1,
        borderWidth: 10,
        borderColor: 'red',
    },
});