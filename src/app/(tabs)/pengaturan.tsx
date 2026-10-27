import { useState } from "react";
import { Text, Button, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTema, ModeTema } from "../../contexts/TemaContext";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { modeTema, setModeTema, warna } = useTema();
  const pilihanTema: { label: string; nilai: ModeTema }[] = [
    { label: "Terang", nilai: "terang" },
    { label: "Gelap", nilai: "gelap" },
    { label: "Ikuti Sistem", nilai: "sistem" },
  ];
  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Gagal menghapus data cuaca. Coba lagi.");
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: warna.background,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: warna.text,
        }}
      >
        Pengaturan
      </Text>
      <Text style={{ color: warna.text }}>Jelajah Aman · Versi 1.0.0</Text>

      <View
        style={{
          padding: 14,
          gap: 12,
          backgroundColor: warna.backgroundElement,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: warna.text,
          }}
        >
          Tema Aplikasi
        </Text>
        <Text style={{ color: warna.textSecondary }}>
          Pilih tampilan aplikasi.
        </Text>
        {pilihanTema.map((pilihan) => {
          const aktif = modeTema === pilihan.nilai;
          return (
            <TouchableOpacity
              key={pilihan.nilai}
              accessibilityRole="radio"
              accessibilityState={{ checked: aktif }}
              onPress={() => {
                setModeTema(pilihan.nilai).catch(() =>
                  Alert.alert(
                    "Gagal",
                    "Pilihan tema tidak dapat disimpan."
                  ));
              }}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: aktif ? "#cf275f" : warna.textSecondary,
                backgroundColor: warna.background,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Text style={{ color: warna.text }}>{pilihan.label}</Text>
              <Text style={{ color: "#cf275f" }}>
                {aktif ? "✓ Dipilih" : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          padding: 14,
          gap: 12,
          backgroundColor: warna.backgroundElement,
          borderRadius: 12,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: warna.text,
          }}>
          Data Aplikasi
        </Text>
        <Button
          title="Hapus Data Cuaca Tersimpan"
          onPress={hapusDataTersimpan}
          color="#cf275f"
        />
        {pesan && (
          <Text
            style={{ color: warna.text }}
            accessibilityLabel={pesan}>
            {pesan}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}