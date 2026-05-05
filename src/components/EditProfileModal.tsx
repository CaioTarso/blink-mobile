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

type Errors = Partial<Record<keyof FormData, string>>;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: UserData) => void;
  user: UserData;
};

const formatBirthdate = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export function EditProfileModal({ visible, onClose, onSubmit, user }: Props) {
  const [form, setForm] = useState<FormData>({
    ...user,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setForm({ ...user, password: "", confirmPassword: "" });
    setErrors({});
  }, [visible]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!form.email.trim()) newErrors.email = "Email é obrigatório";
    if (!form.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!form.birthdate.trim()) newErrors.birthdate = "Data de nascimento é obrigatória";
    if (!form.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!form.address.trim()) newErrors.address = "Endereço é obrigatório";

    if (form.password && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
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
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
              error={errors.email}
            />

            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
              error={errors.phone}
            />

            <Input
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              value={form.birthdate}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, birthdate: formatBirthdate(v) }))
              }
              error={errors.birthdate}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={form.cpf}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, cpf: formatCPF(v) }))
              }
              error={errors.cpf}
            />

            <Input
              label="Endereço"
              placeholder="Rua, número, bairro, cidade"
              value={form.address}
              onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
              error={errors.address}
            />

            <Input
              label="Nova senha"
              placeholder="Digite a nova senha"
              isPassword
              value={form.password}
              onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
              error={errors.password}
            />

            <Input
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              isPassword
              value={form.confirmPassword}
              onChangeText={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
              error={errors.confirmPassword}
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