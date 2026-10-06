// src/app/(tabs)/index.tsx 
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
import { HasilGeocoding } from "../../../types/geocoding";
import { DataCuacaLengkap, DataKualitasUdara } from "../../../types/weather";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useDebounce } from "../../hooks/use-debounce";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { cariKota } from "../../services/geocodingService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { ambilCuaca } from "../../services/weatherService";
 
export default function HalamanUtama() { 
  const [teksCari, setTeksCari] = useState(""); 
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]); 
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null); 
  const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null); 
  const [kualitasUdara, setKualitasUdara] = useState<DataKualitasUdara | null>(null); 
  const [sedangMemuat, setSedangMemuat] = useState(false); 
  const [pesanError, setPesanError] = useState<string | null>(null); 
 
  const teksTertunda = useDebounce(teksCari, 800); 
  const requestIdRef = useRef(0); // pencegah race condition 
 
 useEffect(() => {
  setPesanError(null);
  setCuaca(null);
  setKualitasUdara(null);

  if (teksTertunda.trim().length === 0) {
    setHasilPencarian([]);
    return;
  }

  cariKota(teksTertunda)
    .then(setHasilPencarian)
    .catch(() => {
      setHasilPencarian([]);
      setPesanError("Gagal mencari kota. Periksa koneksi internet Anda.");
    });
}, [teksTertunda]);
 
  async function pilihKota(kota: HasilGeocoding) { 
    setKotaTerpilih(kota); 
    const idSaatIni = ++requestIdRef.current; 
    setSedangMemuat(true); 
    setPesanError(null); 
 
    try {
  //console.log("CEK ambilCuaca:", typeof ambilCuaca);
  //console.log("CEK ambilKualitasUdara:", typeof ambilKualitasUdara);

  const [dataCuaca, dataAQI] = await Promise.all([
    ambilCuaca(kota.latitude, kota.longitude),
    ambilKualitasUdara(kota.latitude, kota.longitude),
  ]);

  if (idSaatIni !== requestIdRef.current) return;

  setCuaca(dataCuaca);
  setKualitasUdara(dataAQI);
}
    catch (err) { 
      //console.error("ERROR DATA CUACA:", err);
      if (idSaatIni !== requestIdRef.current) return; 
      setPesanError("Gagal memuat data cuaca. Periksa koneksi internet Anda."); 
      
    } finally { 
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false); 
    } 
  } 
  function cobaLagi() {
  if (!kotaTerpilih) return;

  pilihKota(kotaTerpilih);
}
  return ( 
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}> 
      <SearchBox onCari={setTeksCari} /> 
 
      {hasilPencarian.map((kota) => ( 
        <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}> 
          <Text>{kota.name}</Text> 
        </TouchableOpacity> 
      ))} 
 
      {sedangMemuat && <ActivityIndicator />} 
 
      {pesanError && ( 
        <View> 
          <Text>{pesanError}</Text> 
          <Button 
          //  title="Coba Lagi" 
          //  onPress={() => kotaTerpilih && pilihKota(kotaTerpilih)}  /> 
          
           title="Coba Lagi"
           onPress={cobaLagi}
          />
        </View> 
      )} 
 
      {cuaca && kualitasUdara && kotaTerpilih && !sedangMemuat && ( 
        <WeatherCard 
          kota={kotaTerpilih.name} 
          suhu={cuaca.saatIni.suhu} 
          tingkatAQI={konversiTingkatAQI(kualitasUdara.indeksAQI)} 
          indeksAQI={kualitasUdara.indeksAQI} 
        /> 
      )} 
 
      {cuaca && ( 
        <Text style={{ fontSize: 12, color: "#888" }}> 
          Kondisi: {labelKodeCuaca(cuaca.saatIni.kodeCuaca)} • Angin 
      {cuaca.saatIni.kecepatanAngin} km/j 
        </Text> 
      )} 
      {cuaca && (
       <View>
       <Text>
          Suhu maksimum hari ini: {cuaca.harian.suhuMaksimal[0]}°C
       </Text>
       <Text>
          Suhu minimum hari ini: {cuaca.harian.suhuMinimal[0]}°C
       </Text>
         </View>
     )}
     {kualitasUdara && (
      <View>
      <Text>
        PM2.5: {kualitasUdara.pm25} µg/m³
      </Text>
      <Text>
        PM10: {kualitasUdara.pm10} µg/m³
      </Text>
      </View>
    )}
      <AtribusiCuaca /> 
    </SafeAreaView> 
  ); 
} 