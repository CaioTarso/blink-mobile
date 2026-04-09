import { colors } from "@/styles/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PersonCircleIcon } from "./admin/icons/profile-icon";

type TopBarProps = {
  userName: string;
};

export function TopBar({
  userName,
}: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <PersonCircleIcon size={32} color="#9CA3AF" style={{ marginRight: 12 }} />

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Olá!</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
      </View>
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
  },

  textContainer: {
    justifyContent: "center",
  },

  greeting: {
    fontSize: 14,
    color: "#6b7280",
  },

  name: {
    fontSize: 16,
    color: "#111827",
  },
});