import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

import { PetsIcon } from "@/components/admin/icons/petsicon";
import { ServicesIcon } from "@/components/admin/icons/services-icon";
import { AppointmentsIcon } from "@/components/admin/icons/appointments-icon";

export function ClientMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const isPets = pathname.includes("pets");
  const isServices = pathname.includes("services");
  const isAppointments = pathname.includes("appointments");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        <MenuItem
          Icon={PetsIcon}
          label="Meus Pets"
          active={isPets}
          onPress={() => router.push("/(protected)/(client)/pets")}
        />

        <MenuItem
          Icon={ServicesIcon}
          label="Agendar"
          active={isServices}
          onPress={() => router.push("/(protected)/(client)/appointments")}
        />

        <MenuItem
          Icon={AppointmentsIcon}
          label="Agendamentos"
          active={isAppointments}
          onPress={() => router.push("/(protected)/(client)/appointments")}
        />
      </View>
    </View>
  );
}

function MenuItem({
  Icon,
  label,
  active,
  onPress,
}: {
  Icon: React.ComponentType<{ color: string }>;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, active && styles.activeIcon]}>
        <Icon color={active ? "#fff" : "#000" } />
      </View>

      <Text style={[styles.label, active && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 12,

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
    padding: 10,
    borderRadius: 20,
  },

  activeIcon: {
    backgroundColor: "#FFA600",
  },

  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#000",
  },

  activeLabel: {
    fontWeight: "600",
    color: "#FFA600",
  },
});