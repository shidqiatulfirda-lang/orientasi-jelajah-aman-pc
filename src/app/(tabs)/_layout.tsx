import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../../contexts/TemaContext";

export default function TabLayout() {
  const { modeTema, warna } = useTema();

  const temaGelap =
    modeTema === "gelap" ||
    (modeTema === "sistem" && warna.background === "#000000");

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        tabBarActiveTintColor: "#cf275f",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          backgroundColor: temaGelap ? "#212225" : "#FFF5F9",
          borderTopColor: temaGelap ? "#3A3A3A" : "#F3D2E2",
        },

        headerStyle: {
          backgroundColor: temaGelap ? "#212225" : "#fff5f9",
        },

        headerTintColor: temaGelap ? "#FFFFFF" : "#9D174D",
        headerTitleStyle: {
          color: warna.text,
        },

        sceneStyle: {
          backgroundColor: warna.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}