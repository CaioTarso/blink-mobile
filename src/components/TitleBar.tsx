import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { colors } from "@/styles/colors";
import { BackIcon } from "@/components/icons/back-icon";

type TitleBarProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  style?: ViewStyle;
};

export function TitleBar({ title, subtitle, onBackPress, style }: TitleBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftWrapper}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconWrapper}>
            <BackIcon color="#111827" />
          </TouchableOpacity>
        )}

        <View style={styles.textWrapper}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },

  leftWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },

  iconWrapper: {
    marginRight: 12,
    marginTop: 6,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 36,
    marginLeft: 16,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
    marginLeft: 16,
  },
});
