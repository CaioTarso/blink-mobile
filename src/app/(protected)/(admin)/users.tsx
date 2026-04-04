import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { UserCard } from "@/components/admin/UserCard";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { colors } from "@/styles/colors";

const initialUsers = [
  {
    id: "1",
    name: "João Silva",
    role: "Admin",
    email: "joao@email.com",
    phone: "(85) 99999-0001",
    tags: ["Banho", "Tosa"],
    active: true,
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "Staff",
    email: "maria@email.com",
    phone: "(85) 99999-0002",
    tags: ["Banho e Tosa"],
    active: true,
  },
  {
    id: "3",
    name: "Carlos Lima",
    role: "Client",
    email: "carlos@email.com",
    phone: "(85) 99999-0003",
    tags: ["Consulta Veterinária"],
    active: false,
  },
];

type User = typeof initialUsers[0];

type ConfirmTarget = {
  id: string;
  name: string;
  currentActive: boolean;
};

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);

  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);
  const [toastOpacity] = useState(new Animated.Value(0));

  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const showToast = (message: string, success: boolean = true) => {
    setToastMessage(message);
    setToastSuccess(success);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const handleToggleActive = (id: string, name: string, currentActive: boolean) => {
    setConfirmTarget({ id, name, currentActive });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    const { id, currentActive } = confirmTarget;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !currentActive } : u))
    );
    showToast(
      !currentActive ? "Usuário ativado com sucesso!" : "Usuário desativado com sucesso!",
      true
    );
    setConfirmTarget(null);
  };

  const handleCancel = () => setConfirmTarget(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormModalVisible(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormModalVisible(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: data.name, email: data.email, phone: data.phone, tags: data.tags }
            : u
        )
      );
      showToast("Usuário atualizado com sucesso!", true);
    } else {
      const newUser: User = {
        id: String(Date.now()),
        name: data.name,
        email: data.email,
        phone: data.phone,
        tags: data.tags,
        role: "Staff",
        active: true,
      };
      setUsers((prev) => [...prev, newUser]);
      showToast("Usuário adicionado com sucesso!", true);
    }
    setFormModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toast */}
      {toastMessage ? (
        <Animated.View
          style={[
            styles.toast,
            toastSuccess ? styles.toastActive : styles.toastInactive,
            { opacity: toastOpacity },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

      {/* Modal de confirmação */}
      <Modal
        visible={!!confirmTarget}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar ação</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.modalAction}>
                {confirmTarget?.currentActive ? "desativar" : "ativar"}
              </Text>{" "}
              o usuário{" "}
              <Text style={styles.modalName}>{confirmTarget?.name}</Text>?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de formulário */}
      <UserFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(protected)/(admin)")}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Equipe</Text>

          <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Gerencie os profissionais do petshop.
        </Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <UserCard
              name={item.name}
              role={item.role}
              email={item.email}
              phone={item.phone}
              tags={item.tags}
              active={item.active}
              onEdit={() => handleOpenEdit(item)}
              onDelete={() => console.log("Excluir", item.name)}
              onToggleActive={() => handleToggleActive(item.id, item.name, item.active)}
            />
          )}
        />
      </View>

      <AdminMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  backIcon: {
    fontSize: 28,
    fontWeight: "600",
  },

  backButton: {
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    flex: 1,
  },

  addButton: {
    backgroundColor: "#54A779",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    color: "gray",
  },

  listContent: {
    paddingBottom: 80,
  },

  toast: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
  },

  toastActive: {
    backgroundColor: "#54A779",
  },

  toastInactive: {
    backgroundColor: "#FB3737",
  },

  toastText: {
    color: "#FFF",
    fontWeight: "400",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    gap: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  modalAction: {
    fontWeight: "bold",
    color: "#333",
  },

  modalName: {
    fontWeight: "bold",
    color: "#333",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  confirmButton: {
    backgroundColor: "#54A779",
  },

  cancelButton: {
    backgroundColor: "#EEE",
  },

  confirmText: {
    color: "#FFF",
    fontWeight: "600",
  },

  cancelText: {
    color: "#555",
    fontWeight: "600",
  },
});