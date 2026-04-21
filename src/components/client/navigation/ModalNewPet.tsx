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
  TextInput,
} from "react-native";
import { colors } from "@/styles/colors";

const PET_TYPES = ["Cachorro", "Gato", "Pássaro", "Outro"];
const PET_SEXES = ["Macho", "Fêmea"];

type PetType = "Cachorro" | "Gato" | "Pássaro" | "Outro";
type PetSex = "Macho" | "Fêmea";

type PetFormData = {
  name: string;
  breed: string;
  type: PetType;
  weight: string;
  age: string;
  sex: PetSex;
  notes: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => void;
  editingPet?: {
    id: string;
    name: string;
    breed: string;
    type: PetType;
    weight: number;
    age: number;
    sex: PetSex;
    notes: string;
  } | null;
};

const emptyForm: PetFormData = {
  name: "",
  breed: "",
  type: "Cachorro",
  weight: "",
  age: "",
  sex: "Macho",
  notes: "",
};

export function ModalNewPet({ visible, onClose, onSubmit, editingPet }: Props) {
  const [form, setForm] = useState<PetFormData>(emptyForm);

  useEffect(() => {
    if (editingPet) {
      setForm({
        name: editingPet.name,
        breed: editingPet.breed,
        type: editingPet.type,
        weight: String(editingPet.weight),
        age: String(editingPet.age),
        sex: editingPet.sex,
        notes: editingPet.notes,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingPet, visible]);

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
          <Text style={styles.title}>
            {editingPet ? `Editar ${editingPet.name}` : "Novo Pet"}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              placeholderTextColor="#aaa"
              value={form.name}
              onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            />

            <Text style={styles.label}>Raça</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Golden Retriever"
              placeholderTextColor="#aaa"
              value={form.breed}
              onChangeText={(v) => setForm((p) => ({ ...p, breed: v }))}
            />

            <Text style={styles.label}>Tipo</Text>
            <View style={styles.tagsGrid}>
              {PET_TYPES.map((t) => {
                const selected = form.type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setForm((p) => ({ ...p, type: t as PetType }))}
                    style={[styles.tagChip, selected && styles.tagChipSelected]}
                  >
                    <Text style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Sexo</Text>
            <View style={styles.tagsGrid}>
              {PET_SEXES.map((s) => {
                const selected = form.sex === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setForm((p) => ({ ...p, sex: s as PetSex }))}
                    style={[styles.tagChip, selected && styles.tagChipSelected]}
                  >
                    <Text style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Peso (KG)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.weight}
              onChangeText={(v) => setForm((p) => ({ ...p, weight: v }))}
            />

            <Text style={styles.label}>Idade (anos)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={form.age}
              onChangeText={(v) => setForm((p) => ({ ...p, age: v }))}
            />

            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Alergias, comportamento, etc."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              value={form.notes}
              onChangeText={(v) => setForm((p) => ({ ...p, notes: v }))}
            />

          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(form)}>
              <Text style={styles.submitText}>
                {editingPet ? "Salvar" : "Cadastrar"}
              </Text>
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
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  scroll: {
    paddingBottom: 8,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 14,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
    color: colors.text,
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
    backgroundColor: "#E5484D",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#fff",
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