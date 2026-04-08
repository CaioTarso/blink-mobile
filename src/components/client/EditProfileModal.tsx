import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";

type UserData = {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  cpf: string;
  address: string;
};

type FormData = UserData & {
  password: string;
  confirmPassword: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: UserData) => void;
  user: UserData;
};

export function EditProfileModal({ visible, onClose, onSubmit, user }: Props) {
  const [form, setForm] = useState<FormData>({
    ...user,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setForm({ ...user, password: "", confirmPassword: "" });
  }, [visible]);

  const handleSubmit = () => {
    const { password, confirmPassword, ...userData } = form;
    onSubmit(userData);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Editar Perfil</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={form.name}
              onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            />

            <Input
              label="Email"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            />

            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            />

            <Input
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              value={form.birthdate}
              onChangeText={(v) => setForm((p) => ({ ...p, birthdate: v }))}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={form.cpf}
              onChangeText={(v) => setForm((p) => ({ ...p, cpf: v }))}
            />

            <Input
              label="Endereço"
              placeholder="Rua, número, bairro, cidade"
              value={form.address}
              onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
            />

            <Input
              label="Nova senha"
              placeholder="Digite a nova senha"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
            />

            <Input
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },

  scroll: {
    alignItems: "center",
    paddingBottom: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
  },

  submitButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});