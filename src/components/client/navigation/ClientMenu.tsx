import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

export function ServiceMenu() {
  const [active, setActive] = useState("Dashboard");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <MenuItem
          icon="pets"
          label="Meus Pets"
          active={active === "Dashboard"}
          onPress={() => setActive("Dashboard")}
        />
        <MenuItem
          icon="calendar-today-schedule"
          label="Agendar Serviços"
          active={active === "Serviços"}
          onPress={() => setActive("Serviços")}
        />
        <MenuItem
          icon="list-alt"
          label="Meus Agendamentos"
          active={active === "Agenda"}
          onPress={() => setActive("Agenda")}
        />
      </View>
    </View>
  );
}

function MenuItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, active && styles.activeIcon]}>
        <MaterialIcons
          name={icon}
          size={28}
          color={active ? "#fff" : colors.primary}
        />
      </View>
      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    backgroundColor: "transparent",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    borderRadius: 10,

  
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },

    elevation: 10,
  },

  item: {
    alignItems: "center",
  },

  iconContainer: {
    padding: 9,
    borderRadius: 20,
  },

  activeIcon: {
    backgroundColor: colors.primary,
  },

  label: {
    fontSize: 12,
    marginTop: 4,
    color: colors.primary,
  },

  activeLabel: {
    fontWeight: "600",
  },
});