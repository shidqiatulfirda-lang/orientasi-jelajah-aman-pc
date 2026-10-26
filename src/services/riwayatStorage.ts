import AsyncStorage from "@react-native-async-storage/async-storage";
export interface ItemRiwayat {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  country: string;
}
const KEY_RIWAYAT = "@jelajah_aman/riwayat_pencarian";
const MAKS_RIWAYAT = 10;
export async function ambilRiwayat(): Promise<ItemRiwayat[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_RIWAYAT);
    return data ? JSON.parse(data) as ItemRiwayat[] : [];
  } catch {
    return [];
  }
}
export async function simpanRiwayat(kota: ItemRiwayat) {
  const daftar = await ambilRiwayat();

  // Kota yang sama dipindahkan ke urutan paling baru.
  const tanpaDuplikat = daftar.filter(
    (item) =>
      item.nama.toLowerCase() !== kota.nama.toLowerCase() ||
      item.latitude !== kota.latitude ||
      item.longitude !== kota.longitude
  );

  const terbaru = [kota, ...tanpaDuplikat].slice(0, MAKS_RIWAYAT);
  await AsyncStorage.setItem(KEY_RIWAYAT, JSON.stringify(terbaru));
}
export async function hapusItemRiwayat(id: number, latitude: number, longitude: number) {
  const daftar = await ambilRiwayat();
  const terbaru = daftar.filter(
    (item) =>
      item.id !== id ||
      item.latitude !== latitude ||
      item.longitude !== longitude
  );
  await AsyncStorage.setItem(KEY_RIWAYAT, JSON.stringify(terbaru));
}

export async function hapusSemuaRiwayat() {
  await AsyncStorage.removeItem(KEY_RIWAYAT);
}
