import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "@/styles/colors";

type StatsCardProps = {
  title: string;
  value: string;
  backgroundColor?: string;
  onPress?: () => void;
};

export function StatsCard({ title, value, onPress, backgroundColor }: StatsCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: backgroundColor ?? colors.primary }
      ]}
    >
      <View style={styles.shape} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 16,      
    padding: 12,          
    marginBottom: 10,      
    overflow: "hidden",
    width: "90%",
    alignSelf: "center",
  },

  shape: {
    position: "absolute",
    bottom: -20,         
    right: -20,
    width: 100,            
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  title: {
    color: colors.surface,
    fontSize: 13,        
    opacity: 0.8,
  },

  value: {
    color: colors.surface,
    fontSize: 26,      
    fontWeight: "bold",
    marginVertical: 6,    
  },
});