import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HasilGeocoding } from "../../../types/geocoding";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasil, setHasil] = useState<HasilGeocoding[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  // Sesuai latihan Modul 4: debounce 800 ms
  const teksTertunda = useDebounce(teksCari, 800);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasil([]);
      setPesanError(null);
      return;
    }

    ambilData(teksTertunda);
  }, [teksTertunda]);

  async function ambilData(nama: string) {
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await cariKota(nama);
      setHasil(data);
    } catch (err) {
      setPesanError(
        "Gagal mengambil data. Periksa koneksi internet Anda."
      );
    } finally {
      setSedangMemuat(false);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
      }}
    >
      <SearchBox onCari={setTeksCari} />

      {/* Loading */}
      {sedangMemuat && (
        <ActivityIndicator accessibilityLabel="Sedang mencari kota" />
      )}

      {/* Error */}
      {pesanError && (
        <View accessible accessibilityLabel="Terjadi kesalahan saat mencari kota">
          <Text>{pesanError}</Text>

          <Button
            title="Coba Lagi"
            onPress={() => ambilData(teksTertunda)}
          />
        </View>
      )}

      {/* Empty state */}
      {!sedangMemuat &&
        !pesanError &&
        teksTertunda.trim().length > 0 &&
        hasil.length === 0 && (
          <Text accessibilityLabel="Kota tidak ditemukan">
            Kota tidak ditemukan
          </Text>
        )}

      {/* Jumlah hasil */}
      {!sedangMemuat &&
        !pesanError &&
        hasil.length > 0 && (
          <Text>
            Ditemukan {hasil.length} kota
          </Text>
        )}

      {/* Hasil pencarian */}
      {hasil.map((kota) => (
        <WeatherCard
          key={kota.id}
          kota={kota.name}
          suhu={29}
          tingkatAQI="BAIK"
          onPress={() =>
            router.push({
              pathname: "/detail/[kota]",
              params: {
                kota: kota.name,
              },
            })
          }
        />
      ))}
    </SafeAreaView>
  );
}