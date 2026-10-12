import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";

interface RiwayatListProps {
  daftarKota: string[];
}

export default function RiwayatList({
  daftarKota,
}: RiwayatListProps) {
  return (
    <View style={{ gap: 12 }}>
      {daftarKota.map((kota) => (
        <Pressable
          key={kota}
          onPress={() =>
            router.push({
              pathname: "/detail/[kota]",
              params: { kota },
            })
          }
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
          }}
        >
          <Text>{kota}</Text>
        </Pressable>
      ))}
    </View>
  );
}