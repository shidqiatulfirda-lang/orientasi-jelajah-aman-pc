import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../../types/favorit";

import { ambilRiwayat, hapusItemRiwayat, ItemRiwayat } from "../../services/riwayatStorage";
import { daftarKotaTersimpan, hapusCacheKota } from "../../services/cacheRepository";
import { RingkasanKotaTersimpan } from "../../../types/cache";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayat[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);
  const muatData = useCallback(async () => {
    const [favorit, riwayat, cache] = await Promise.all([
      ambilSemuaFavorit(),
      ambilRiwayat(),
      daftarKotaTersimpan(),
    ]);
    setDaftarFavorit(favorit);
    setDaftarRiwayat(riwayat);
    setDaftarCache(cache);
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  function konfirmasi(
    judul: string,
    pesan: string,
    aksi: () => Promise<void>
  ) {
    if (Platform.OS === "web") {
      if (globalThis.confirm(pesan)) {
        void aksi();
      }
      return;
    }
    Alert.alert(judul, pesan, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => void aksi(),
      },
    ]);
  }

  function hapusKotaFavorit(kota: KotaFavorit) {
    konfirmasi(
      "Hapus Favorit",
      `Yakin hapus ${kota.nama} dari favorit?`,
      async () => {
        await hapusFavorit(kota.id);
        await muatData();
      }
    );
  }

  function hapusKotaRiwayat(kota: ItemRiwayat) {
    konfirmasi(
      "Hapus Riwayat",
      `Hapus ${kota.nama} dari riwayat pencarian?`,
      async () => {
        await hapusItemRiwayat(
          kota.id,
          kota.latitude,
          kota.longitude
        );
        await muatData();
      }
    );
  }

  function hapusCacheKotaTersimpan(kota: RingkasanKotaTersimpan) {
  konfirmasi(
    "Hapus Cache Kota",
    `Yakin hapus cache cuaca ${kota.nama} dari perangkat?`,
    async () => {
      await hapusCacheKota(kota.latitude, kota.longitude);
      await muatData();
    }
  );
}

  function bukaKota(kota: ItemRiwayat) {
    router.push({
      pathname: "/",
      params: {
        riwayatId: String(kota.id),
        nama: kota.nama,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
        country: kota.country,
      },
    });
  }

  return (
        <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        gap: 10,
        }}
        showsVerticalScrollIndicator>

        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          Riwayat Pencarian
        </Text>
        <Text>{daftarRiwayat.length} dari 10 kota terbaru</Text>
        {daftarRiwayat.length === 0 ? (
          <Text>Belum ada riwayat pencarian.</Text>
        ) : (
          daftarRiwayat.map((kota, index) => (
            <View
              key={`${kota.id}-${kota.latitude}-${kota.longitude}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#EEEEEE",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => bukaKota(kota)}
              >
                <Text>{index + 1}. {kota.nama}</Text>
                <Text style={{ color: "#777777", fontSize: 12 }}>
                  Ketuk untuk melihat cuaca
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => hapusKotaRiwayat(kota)}>
                <Text style={{ color: "#DB2777", padding: 8 }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",
            marginTop: 20,
            paddingTop: 16,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Kota Favorit
          </Text>
          <Text>Tersimpan {daftarFavorit.length} kota</Text>
          {daftarFavorit.length === 0 ? (
            <Text>Belum ada kota favorit.</Text>
          ) : (
            daftarFavorit.map((kota) => (
              <View
                key={kota.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EEEEEE",
                }}
              >
                <Text>{kota.nama}</Text>

                <TouchableOpacity
                  onPress={() => hapusKotaFavorit(kota)}
                >
                  <Text style={{ color: "#DB2777", padding: 8 }}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
          
        <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          marginTop: 20,
          paddingTop: 16,
          gap: 10,
          }}
          >
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
         Kota Tersimpan di Perangkat
        </Text>
        {daftarCache.length === 0 ? (
        <Text>Belum ada cache kota tersimpan.</Text>
        ) : (
        daftarCache.map((kota) => (
      <View
        key={kota.kunci}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#EEEEEE",
        }}
        >
        <Text style={{ flex: 1 }}>{kota.nama}</Text>

        <TouchableOpacity
          onPress={() => hapusCacheKotaTersimpan(kota)}
        >
          <Text style={{ color: "#DB2777", padding: 8 }}>
            Hapus Cache
          </Text>
        </TouchableOpacity>
      </View>
       ))
       )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
