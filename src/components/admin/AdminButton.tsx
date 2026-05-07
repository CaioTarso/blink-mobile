import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type AdminButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: "edit" | "delete";
};

export function AdminButton({
  children,
  onPress,
  disabled,
  variant = "edit",
}: AdminButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === "edit" && styles.editButton,
        variant === "delete" && styles.deleteButton,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  editButton: {
    backgroundColor: "#EBB850",
  },

  deleteButton: {
    backgroundColor: "#E5484D",
  },

  disabled: {
    backgroundColor: "#CCC",
  },

  text: {
    color: "#FFF",
    fontWeight: "600",
  },
});