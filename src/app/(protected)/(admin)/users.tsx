import React, { useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { UserCard } from "@/components/admin/UserCard";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { AddIcon } from "@/components/icons/add-icon";
import { registerStaff } from "@/services/auth";

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
  const [users, setUsers] = useState(initialUsers);

  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);
  const [toastOpacity] = useState(new Animated.Value(0));

  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    showToast("Usuário excluído com sucesso!", true);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => setDeleteTarget(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormModalVisible(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormModalVisible(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: data.name, email: data.email, phone: data.phone, tags: data.tags }
            : u
        )
      );
      showToast("Usuário atualizado com sucesso!", true);
      setFormModalVisible(false);
    } else {
      setIsLoading(true);
      try {
        const { staff, generated_credentials } = await registerStaff({
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          hired_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        });

        const newUser: User = {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          phone: data.phone,
          tags: data.tags,
          role: "Staff",
          active: true,
        };
        setUsers((prev) => [...prev, newUser]);
        setFormModalVisible(false);
        Alert.alert(
          "Staff criado com sucesso!",
          `Credenciais geradas:\nEmail: ${generated_credentials.email}\nSenha: ${generated_credentials.password}`
        );
        showToast("Membro da equipe adicionado com sucesso!", true);
      } catch (error: any) {
        showToast(
          error.response?.data?.message || "Erro ao adicionar staff",
          false
        );
        Alert.alert("Erro", error.message || "Falha ao criar staff");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.modalAction}>excluir</Text>{" "}
              o usuário{" "}
              <Text style={styles.modalName}>{deleteTarget?.name}</Text>?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <UserFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
        isLoading={isLoading}
      />

      <View style={styles.content}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Equipe</Text>

          <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
            <AddIcon color="#fff" size={20} />
            <Text style={styles.addButtonText}>Novo Membro</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Gerencie os profissionais do petshop
        </Text>

        <FlatList
          data={[...users].sort((a, b) => a.name.localeCompare(b.name))}
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
              onDelete={() => handleDelete(item.id, item.name)}
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
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54A779",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
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
    marginLeft: 16,
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
    backgroundColor: "#E5484D",
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
