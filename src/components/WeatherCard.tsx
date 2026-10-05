import { Pressable, Text } from "react-native";
import { WeatherCardProps } from "../../types/cuaca";
import { spacing } from "../constants/styles";

type Props = WeatherCardProps & {
  onPress?: () => void;
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
        marginBottom: spacing.sedang,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {kota}
      </Text>

      <Text style={{ marginTop: 8 }}>
        Suhu: {suhu}°C
      </Text>

      <Text style={{ marginTop: 4 }}>
        Kualitas udara: {tingkatAQI}
      </Text>
    </Pressable>
  );
}