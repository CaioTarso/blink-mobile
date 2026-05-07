import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  isPassword?: boolean;
  isSearch?: boolean;
  onSearch?: () => void;
};

export function Input({
  label,
  error,
  isPassword = false,
  isSearch = false,
  onSearch,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error ? styles.errorBorder : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}

        {isSearch && (
          <TouchableOpacity
            onPress={onSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginLeft: 8 }}
          >
            <Ionicons name="search" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    minHeight: 48,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
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
