import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { BackIcon } from "@/components/icons/back-icon";
import { EditProfileModal } from "@/components/client/EditProfileModal";
import { colors } from "@/styles/colors";

const mockUser = {
  name: "Carlos Lima",
  email: "carlos@email.com",
  phone: "(85) 99999-0003",
  birthdate: "15/03/1990",
  cpf: "123.456.789-00",
  address: "Rua das Flores, 123 - Fortaleza, CE",
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  const [modalVisible, setModalVisible] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

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

  const handleSave = (data: typeof mockUser) => {
    setUser((prev) => ({ ...prev, ...data }));
    setModalVisible(false);
    showToast("Alterações salvas com sucesso!");
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
        user={user}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Minha Conta</Text>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EditIcon color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* Campos */}
        <View style={styles.section}>
          <Field label="Nome completo" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Telefone" value={user.phone} />
          <Field label="Data de nascimento" value={user.birthdate} />
          <Field label="CPF" value={user.cpf} />
          <Field label="Endereço" value={user.address} />
        </View>

        {/* Botão editar */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        {/* Botão sair */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
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

function EditIcon({ color = "#000" }: { color?: string }) {
  const Svg = require("react-native-svg").default;
  const { Path } = require("react-native-svg");
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
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
    gap: 8,
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
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
    borderColor: "#FB3737",
  },

  logoutText: {
    color: "#FB3737",
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
});