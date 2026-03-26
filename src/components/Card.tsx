import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface || colors.primary,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    width: "90%",
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.primary,
  },
});