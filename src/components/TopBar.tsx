import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TopBarProps = {
  userName: string;
};

export function TopBar({ userName }: TopBarProps) {
  const router = useRouter();
  const initial = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.avatar}
        onPress={() => router.push("/(protected)/(admin)/admin-profile")}
        activeOpacity={0.8}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  textContainer: {
    justifyContent: "center",
  },

  greeting: {
    fontSize: 13,
    color: "#6b7280",
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
});
