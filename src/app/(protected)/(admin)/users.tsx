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

const userName = [
  {
    id: "1",
    name: "João Silva",
    role: "Admin",
    email: "joao@email.com",
    tags: ["Banho", "Tosa"],
    active: true,
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "Staff",
    email: "maria@email.com",
    tags: ["Banho e Tosa"],
    active: true,
  },
  {
    id: "3",
    name: "Carlos Lima",
    role: "Client",
    email: "carlos@email.com",
    tags: ["Consulta"],
    active: false,
  },
];

type ConfirmTarget = {
  id: string;
  name: string;
  currentActive: boolean;
};

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState(userName);

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
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
      !currentActive ? "Usuário ativado com sucesso!" : "Usuário desativado com sucesso!"
    );

    setConfirmTarget(null);
  };

  const handleCancel = () => {
    setConfirmTarget(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Toast */}
      {toastMessage ? (
        <Animated.View
          style={[
            styles.toast,
            toastMessage === "Usuário ativado com sucesso!"
              ? styles.toastActive
              : styles.toastInactive,
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
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  confirmTarget?.currentActive
                    ? styles.deactivateConfirmButton
                    : styles.activateConfirmButton,
                ]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(protected)/(admin)")}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Equipe</Text>
        </View>

        <View>
          <Text>Adicionar +</Text>
        </View>

        <Text style={styles.subtitle}>
          Gerencie os profissionais do petshop
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
              tags={item.tags}
              active={item.active}
              onEdit={() => console.log("Editar", item.name)}
              onDelete={() => console.log("Excluir", item.name)}
              onToggleActive={() =>
                handleToggleActive(item.id, item.name, item.active)
              }
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

  // Modal
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

  cancelButton: {
    backgroundColor: "#EEEEEE",
  },

  activateConfirmButton: {
    backgroundColor: "#54A779",
  },

  deactivateConfirmButton: {
     backgroundColor: "#54A779",
  },

  cancelText: {
    color: "#555",
    fontWeight: "600",
  },

  confirmText: {
    color: "#FFF",
    fontWeight: "600",
  },
});