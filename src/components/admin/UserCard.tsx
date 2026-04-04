import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Card } from "@/components/Card";
import { AdminButton } from "./AdminButton";
import { UserIcon } from "./icons/user-icon";

type UserCardProps = {
  name: string;
  role: string;
  email: string;
  phone: string;
  tags: string[];
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
};

export function UserCard({
  name,
  role,
  email,
  phone,
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

            <View style={styles.info}>
              <Text style={[styles.name, !active && styles.inactive]}>
                {name}
              </Text>
              <Text style={[styles.role, !active && styles.inactive]}>
                {role}
              </Text>
              <Text style={[styles.email, !active && styles.inactive]} numberOfLines={1} ellipsizeMode="tail">
                {email}
              </Text>
              <Text style={[styles.phone, !active && styles.inactive]} numberOfLines={1} ellipsizeMode="tail">
                {phone}
              </Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, !active && styles.tagInactive]}>
                    <Text style={[styles.tagText, !active && styles.tagTextInactive]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onToggleActive}
            style={[
              styles.toggleButton,
              active ? styles.toggleDeactivate : styles.toggleActivate,
            ]}
          >
            <Text style={styles.toggleText}>
              {active ? "Desativar" : "Ativar"}
            </Text>
          </TouchableOpacity>
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
    marginTop: 2,
  },

  left: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    flexShrink: 1,
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

  phone: {
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
    backgroundColor: "#364E98",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  tagInactive: {
    backgroundColor: "#ddd",
  },

  tagText: {
    fontSize: 11,
    color: "#fff",
  },

  tagTextInactive: {
    color: "#999",
  },

  inactive: {
    opacity: 0.4,
  },

  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 78,
  },

  toggleDeactivate: {
    backgroundColor: "#4A6FA5",
  },

  toggleActivate: {
    backgroundColor: "#54A779",
  },

  toggleText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
  },

  editButton: {
    flex: 1,
  },

  deleteButton: {
    width: "30%",
  },
});