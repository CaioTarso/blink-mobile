import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

import { DashboardIcon } from "@/components/admin/icons/dashboard-icon";
import { ServicesIcon } from "@/components/admin/icons/services-icon";
import { AppointmentsIcon } from "@/components/admin/icons/appointments-icon";
import { TeamsIcon } from "@/components/admin/icons/teams-icon";

export function AdminMenu() {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname === "/" || pathname === "";
  const isUsers = pathname.includes("users");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        <MenuItem
          Icon={DashboardIcon}
          label="Dashboard"
          active={isDashboard}
          onPress={() => {
            setActive("Dashboard");
            router.push("/(protected)/(admin)");
          }}
        />

        <MenuItem
          Icon={ServicesIcon}
          label="Serviços"
          active={active === "Serviços"}
          onPress={() => setActive("Serviços")}
        />

        <MenuItem
          Icon={AppointmentsIcon}
          label="Agenda"
          active={active === "Agenda"}
          onPress={() => setActive("Agenda")}
        />

        <MenuItem
          Icon={TeamsIcon}
          label="Equipes"
          active={isUsers}
          onPress={() => {
            setActive("Equipes");
            router.push("/(protected)/(admin)/users");
          }}
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
      <View style={styles.iconContainer}>
        <Icon color={active ? "#FFA600" : "#000000"} />
      </View>

      <Text
        style={[
          styles.label,
          { color: active ? "#FFA600" : "#000000" },
        ]}
      >
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
    backgroundColor: "transparent",
  },

  label: {
    fontSize: 12,
    marginTop: 4,
  },
});