import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EditIcon } from "@/components/icons/edit-icon";
import { EditProfileModal } from "@/components/EditProfileModal";
import { ClientMenu } from "@/components/client/navigation/ClientMenu";
import { colors } from "@/styles/colors";
import { useAuth } from "@/context/AuthContext";

export default function ClientProfileScreen() {
  const { user, logout, fetchUser, updateUser, isLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchUser();
  }, []);

  const profileData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    birthdate: user?.birthdate ?? "",
    cpf: user?.cpf ?? "",
    address: user?.address ?? "",
  };

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

  const handleSave = async (data: typeof profileData) => {
    try {
      await updateUser(data);
      setModalVisible(false);
      showToast("Alterações salvas com sucesso!");
    } catch {
      showToast("Erro ao salvar alterações.");
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {toastMessage ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSave}
        user={profileData}
      />

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sair</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.modalAction}>sair</Text> da sua conta?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Minha Conta</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EditIcon color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.userName}>{profileData.name}</Text>
        </View>

        <View style={styles.section}>
          <Field label="Nome completo" value={profileData.name} />
          <Field label="Email" value={profileData.email} />
          <Field label="Telefone" value={profileData.phone} />
          <Field label="Data de nascimento" value={profileData.birthdate} />
          <Field label="CPF" value={profileData.cpf} />
          <Field label="Endereço" value={profileData.address} />
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <ClientMenu />
    </SafeAreaView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 16,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  avatarInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },

  field: {
    gap: 4,
  },

  fieldLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },

  fieldValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },

  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  logoutButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  logoutText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },

  toast: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#54A779",
    zIndex: 9999,
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
