import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/theme";
export type ModeTema = "terang" | "gelap" | "sistem";
type TemaContextType = {
  modeTema: ModeTema;
  setModeTema: (mode: ModeTema) => Promise<void>;
  warna: (typeof Colors)["light"] | (typeof Colors)["dark"];
};
const TemaContext = createContext<TemaContextType | null>(null);
const KEY_TEMA = "@jelajah_aman/mode_tema";
export function TemaProvider({
  children,
}: {children: React.ReactNode;
}) {
  const skemaSistem = useColorScheme();
  const [modeTema, aturModeTema] = useState<ModeTema>("sistem");
  useEffect(() => {
    AsyncStorage.getItem(KEY_TEMA)
      .then((nilai) => {
        if (
          nilai === "terang" ||
          nilai === "gelap" ||
          nilai === "sistem"
        ) {
          aturModeTema(nilai);
        }
      })
      .catch(() => {});
  }, []);

  async function setModeTema(mode: ModeTema) {
    aturModeTema(mode);
    await AsyncStorage.setItem(KEY_TEMA, mode);
  }
  const modeAktif =
    modeTema === "sistem"
      ? skemaSistem === "dark"
        ? "dark"
        : "light"
      : modeTema === "gelap"
        ? "dark"
        : "light";
  return (
    <TemaContext.Provider
      value={{
        modeTema,
        setModeTema,
        warna: Colors[modeAktif],
      }}
    >
      {children}
    </TemaContext.Provider>
  );
}
export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema harus digunakan di dalam TemaProvider");
  }
  return context;
}
