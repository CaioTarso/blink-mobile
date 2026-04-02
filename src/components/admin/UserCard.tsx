import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { Card } from "@/components/Card";
import { AdminButton } from "./AdminButton";
import { UserIcon } from "./icons/user-icon";
import { CustomSwitch } from "./CustomSwitch";

type UserCardProps = {
  name: string;
  role: string;
  email: string;
  tags: string[];
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (value: boolean) => void;
};

export function UserCard({
  name,
  role,
  email,
  tags,
  active,
  onEdit,
  onDelete,
  onToggleActive,
}: UserCardProps) {
  return (
    <View style={styles.wrapper}>
      <Card>
        <View style={styles.header}>
          <View style={styles.left}>
            <View style={styles.avatar}>
              <UserIcon color={active ? "#000" : "#999"} />
            </View>

            <View>
              <Text style={[styles.name, !active && styles.inactive]}>
                {name}
              </Text>
              <Text style={[styles.role, !active && styles.inactive]}>
                {role}
              </Text>
              <Text style={[styles.email, !active && styles.inactive]}>
                {email}
              </Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <CustomSwitch
            value={active}
            onChange={onToggleActive}
          />
        </View>

        <View style={styles.actions}>
          <View style={styles.editButton}>
            <AdminButton onPress={onEdit} disabled={!active} variant="edit">
              Editar
            </AdminButton>
          </View>

          <View style={styles.deleteButton}>
            <AdminButton onPress={onDelete} disabled={!active} variant="delete">
              Excluir
            </AdminButton>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 100,
    marginTop: 2,
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
    backgroundColor: "#EEE",
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

  email: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },

  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  tagText: {
    fontSize: 11,
    color: "#555",
  },

  inactive: {
    opacity: 0.4,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
  },

  editButton: {
    width: "60%",
  },

  deleteButton: {
    width: "30%",
  },
});