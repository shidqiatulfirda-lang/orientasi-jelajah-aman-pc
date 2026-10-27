
import { Stack } from "expo-router";
import { TemaProvider } from "../../src/contexts/TemaContext";

export default function RootLayout() {
  return (
    <TemaProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail/[kota]"
          options={{ title: "Detail Cuaca" }}
        />
        <Stack.Screen
          name="tambah-favorit"
          options={{
            presentation: "modal",
            title: "Tambah Favorit",
          }}
        />
      </Stack>
    </TemaProvider>
  );
}
