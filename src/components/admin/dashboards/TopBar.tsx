import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "@/styles/colors";
import { BellIcon } from "../icons/bell-icon";

type TopBarProps = {
  userName: string;
  avatarUri?: string;
  onNotificationPress?: () => void;
  hasNotification?: boolean;
};

export function TopBar({
  userName,
  avatarUri,
  onNotificationPress,
  hasNotification = false,
}: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={{ uri: avatarUri || "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Olá!</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.notification}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <BellIcon size={24} hasNotification={hasNotification} />
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
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
    fontWeight: "bold",
    color: "#111827",
  },

  notification: {
    justifyContent: "center",
    alignItems: "center",
    height: 40, 
  },
});