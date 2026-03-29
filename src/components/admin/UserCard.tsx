import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { Card } from "@/components/Card";
import { AdminButton } from "./AdminButton";
import { UserIcon } from "./icons/user-icon";

type UserCardProps = {
  name: string;
  role: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (value: boolean) => void;
};

export function UserCard({
  name,
  role,
  active,
  onEdit,
  onDelete,
  onToggleActive,
}: UserCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <UserIcon color={active ? "#000" : "#999"} />
          </View>

          <View>
            <Text style={[styles.name, { opacity: active ? 1 : 0.4 }]}>
              {name}
            </Text>
            <Text style={[styles.role, { opacity: active ? 1 : 0.4 }]}>
              {role}
            </Text>
          </View>
        </View>

        <Switch value={active} onValueChange={onToggleActive} />
      </View>

      <View style={styles.actions}>
        <AdminButton onPress={onEdit} disabled={!active}>
          Editar
        </AdminButton>
        <AdminButton onPress={onDelete} disabled={!active}>
          Excluir
        </AdminButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  role: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
});