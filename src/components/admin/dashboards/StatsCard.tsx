import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/styles/colors";

type StatsCardProps = {
  title: string;
  value: string;
  backgroundColor?: string;
  onPress?: () => void;
};

export function StatsCard({ title, value, onPress }: StatsCardProps) {
  return (
    <View style={styles.card}>
      
      <View style={styles.shape} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      <View style={styles.footer}>
        <Text style={styles.link}>Ver detalhes</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  link: {
    color: colors.surface,
    fontSize: 12,       
    opacity: 0.9,
  },

  button: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 30,             
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    fontSize: 14,        
    fontWeight: "bold",
    color: colors.surface,
  },
});