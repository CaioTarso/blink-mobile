import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { colors } from "@/styles/colors";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          isFocused && styles.focused,
          error && styles.errorBorder,
        ]}
        placeholderTextColor="#999"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "90%",
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surface || colors.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },
  focused: {
    borderColor: colors.primary,
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },
});