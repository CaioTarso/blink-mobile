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
  ActivityIndicator,
} from "react-native";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";

const ESPECIALIDADES = [
  "Banho",
  "Tosa",
  "Banho e Tosa",
  "Consulta Veterinária",
  "Hospedagem",
  "Outro",
];

type UserFormData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  tags: string[];
  customTag: string;
  role: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  editingUser?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    tags: string[];
    role: string;
  } | null;
  isLoading?: boolean;
};

const emptyForm: UserFormData = {
  name: "",
  email: "",
  phone: "",
  position: "",
  tags: [],
  customTag: "",
  role: "",
};

export function UserFormModal({ visible, onClose, onSubmit, editingUser, isLoading = false }: Props) {
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const isEditing = !!editingUser;

  useEffect(() => {
    if (editingUser) {
      const knownTags = editingUser.tags.filter((t) => ESPECIALIDADES.includes(t));
      const customTag = editingUser.tags.find((t) => !ESPECIALIDADES.includes(t)) ?? "";

      setForm({
        ...emptyForm,
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone ?? "",
        role: editingUser.role,
        tags: customTag ? [...knownTags, "Outro"] : knownTags,
        customTag,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingUser, visible]);

  const toggleTag = (tag: string) => {
    setForm((prev) => {
      const has = prev.tags.includes(tag);
      return {
        ...prev,
        tags: has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleSubmit = () => {
    const finalTags = form.tags.includes("Outro") && form.customTag.trim()
      ? [...form.tags.filter((t) => t !== "Outro"), form.customTag.trim()]
      : form.tags.filter((t) => t !== "Outro");

    onSubmit({ ...form, tags: finalTags });
  };

  const title = isEditing ? `Editar ${editingUser.name}` : "Novo Membro da Equipe";
  const submitLabel = isEditing ? "Salvar" : "Adicionar";

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
          <Text style={styles.title}>{title}</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Input
              label="Nome"
              placeholder="Nome completo"
              value={form.name}
              onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
              editable={!isLoading}
            />

            <Input
              label="Email"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
              editable={!isLoading}
            />

            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
              editable={!isLoading}
            />

            <Input
              label="Cargo"
              placeholder="Ex: Veterinário, Tosador"
              value={form.position}
              onChangeText={(v) => setForm((p) => ({ ...p, position: v }))}
              editable={!isLoading}
            />

            <Text style={styles.infoText}>
              A senha do staff será gerada automaticamente usando o primeiro nome e os últimos 4 dígitos do celular.
            </Text>

            <Text style={styles.label}>Especialidades</Text>
            <View style={styles.tagsGrid}>
              {ESPECIALIDADES.map((tag) => {
                const selected = form.tags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.tagChip, selected && styles.tagChipSelected]}
                  >
                    <Text style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {form.tags.includes("Outro") && (
              <Input
                label="Especialidade personalizada"
                placeholder="Digite a especialidade"
                value={form.customTag}
                onChangeText={(v) => setForm((p) => ({ ...p, customTag: v }))}
              />
            )}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{submitLabel}</Text>
              )}
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

  label: {
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },

  infoText: {
    width: "90%",
    color: "#666",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },

  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "90%",
    marginBottom: 16,
  },

  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },

  tagChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tagChipText: {
    fontSize: 13,
    color: "#555",
  },

  tagChipTextSelected: {
    color: "#fff",
    fontWeight: "600",
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
    backgroundColor: "#54A779",
    alignItems: "center",
    justifyContent: "center",
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});