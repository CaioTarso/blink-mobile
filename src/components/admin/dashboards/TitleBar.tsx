import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { colors } from "@/styles/colors";
import { BackArrowIcon } from "../icons/back-icon";
import { AddIcon } from "../icons/add-icon";

type TitleBarProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onAddPress?: () => void;
  style?: ViewStyle;
};

export function TitleBar({
  title,
  subtitle,
  onBackPress,
  onAddPress,
  style,
}: TitleBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftWrapper}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconWrapper}>
            <BackArrowIcon color="#111827" size={28} />
          </TouchableOpacity>
        )}

        <View style={styles.textWrapper}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {onAddPress && (
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <AddIcon color="#111827" size={28} />
        </TouchableOpacity>
      )}
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
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: -4, 
  },

  addButton: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
});