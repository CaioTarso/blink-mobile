import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type AdminButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export function AdminButton({ children, onPress, disabled }: AdminButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#ccc" : "#7c3aed" },
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});