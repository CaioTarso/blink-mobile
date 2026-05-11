import { Input } from "@/components/Input";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { AddIcon } from "@/components/icons/add-icon";
import { serviceService } from "@/services/services";
import { colors } from "@/styles/colors";
import { DeleteTarget, Service, ToggleTarget } from "@/types/service";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emptyForm = { name: "", description: "", price: "", durationMinutes: "", imageUrl: "" };
type FormErrors = Partial<Record<keyof typeof emptyForm, string>>;

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"new" | "edit" | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [image, setImage] = useState<string | null>(null);
  const [toggleTarget, setToggleTarget] = useState<ToggleTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const loadServices = async () => {
    try {
      const data = await serviceService.getAll();

      const formatted = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        description: item.description,
        price: Number(item.price),
        duration_minutes: item.duration_minutes ? Number(item.duration_minutes) : undefined,
        image: item.image_url,
        active: item.active,
      }));

      setServices(formatted);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar serviços");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (modalMode === "edit" && editingService) {
      setForm({
        name: editingService.name,
        description: editingService.description,
        price: editingService.price.toFixed(2),
        durationMinutes: editingService.duration_minutes ? String(editingService.duration_minutes) : "",
        imageUrl: editingService.image,
      });
      setImage(null);
      setErrors({});
    } else if (modalMode === "new") {
      setForm(emptyForm);
      setImage(null);
      setErrors({});
    }
  }, [modalMode, editingService]);

  const filteredServices = search.trim()
    ? services.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      )
    : services;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingService(null);
    setForm(emptyForm);
    setErrors({});
    setImage(null);
  };

  const handleOpenEdit = (item: Service) => {
    setEditingService(item);
    setModalMode("edit");
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!form.description.trim())
      newErrors.description = "Descrição é obrigatória";
    if (!form.price.trim()) newErrors.price = "Preço é obrigatório";
    if (!form.durationMinutes.trim()) newErrors.durationMinutes = "Duração é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (modalMode === "edit" && editingService) {
      try {
        await serviceService.update(editingService.id, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price.replace(",", ".")),
          duration_minutes: parseInt(form.durationMinutes, 10),
          image_url: image || form.imageUrl,
        });

        await loadServices();

        handleCloseModal();
      } catch (error) {
        console.log(error);
        alert("Erro ao atualizar serviço");
      }
    } else if (modalMode === "new") {
      try {
        const formData = new FormData();

        formData.append("name", form.name);

        formData.append("description", form.description);

        formData.append(
          "price",
          String(parseFloat(form.price.replace(",", "."))),
        );

        formData.append("duration_minutes", form.durationMinutes);

        if (image) {
          const response = await fetch(image);

          const blob = await response.blob();

          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              resolve(reader.result as string);
            };

            reader.onerror = reject;

            reader.readAsDataURL(blob);
          });

          formData.append("image_url", base64);
        }

        if (form.imageUrl && !image) {
          formData.append("image_url", form.imageUrl);
        }

        await serviceService.create(formData);

        await loadServices();

        handleCloseModal();
      } catch (error) {
        console.log(error);
        alert("Erro ao criar serviço");
      }
    }
    handleCloseModal();
  };

  const handleConfirmToggle = () => {
    if (!toggleTarget) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === toggleTarget.id
          ? { ...s, active: !toggleTarget.currentActive }
          : s,
      ),
    );
    setToggleTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await serviceService.delete(deleteTarget.id);

      await loadServices();

      setDeleteTarget(null);
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar serviço");
    }
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Serviços</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalMode("new")}
          >
            <AddIcon color="#fff" size={20} />
            <Text style={styles.addButtonText}>Novo Serviço</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Gerencie os serviços oferecidos pelo petshop
        </Text>

        <View style={styles.searchRow}>
          <Input
            placeholder="Buscar"
            isSearch
            value={search}
            onChangeText={setSearch}
            onSearch={() => {}}
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Foto */}
              <Image
                source={{ uri: item.image }}
                style={[styles.cardImage, !item.active && styles.dimmed]}
              />

              {/* Conteúdo direito */}
              <View style={styles.cardInfo}>
                {/* Linha 1: título + badge + toggle */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <Text
                      style={[styles.cardTitle, !item.active && styles.dimmed]}
                    >
                      {item.name}
                    </Text>
                    {!item.active && (
                      <View style={styles.inactiveBadge}>
                        <Text style={styles.inactiveBadgeText}>Inativo</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      item.active ? styles.btnDeactivate : styles.btnActivate,
                    ]}
                    onPress={() =>
                      setToggleTarget({
                        id: item.id,
                        name: item.name,
                        currentActive: item.active,
                      })
                    }
                  >
                    <Text style={styles.toggleText}>
                      {item.active ? "Desativar" : "Ativar"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Descrição e preço */}
                <Text
                  style={[
                    styles.cardDescription,
                    !item.active && styles.dimmed,
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <Text style={[styles.cardPrice, !item.active && styles.dimmed]}>
                  R$ {item.price.toFixed(2)}
                </Text>

                {/* Linha de botões: Editar largo + Excluir menor */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[
                      styles.btnEdit,
                      item.active
                        ? { backgroundColor: "#FFA500" }
                        : styles.btnDisabled,
                    ]}
                    onPress={() => handleOpenEdit(item)}
                    disabled={!item.active}
                  >
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.btnDelete,
                      item.active
                        ? { backgroundColor: "#E5484D" }
                        : styles.btnDisabled,
                    ]}
                    onPress={() =>
                      setDeleteTarget({ id: item.id, name: item.name })
                    }
                    disabled={!item.active}
                  >
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal confirmação ativar/desativar */}
      <RNModal
        visible={!!toggleTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setToggleTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Confirmar ação</Text>
            <Text style={styles.confirmMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.confirmBold}>
                {toggleTarget?.currentActive ? "desativar" : "ativar"}
              </Text>{" "}
              o serviço{" "}
              <Text style={styles.confirmBold}>{toggleTarget?.name}</Text>?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={handleConfirmToggle}
              >
                <Text style={styles.confirmBtnTextLight}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#EEE" }]}
                onPress={() => setToggleTarget(null)}
              >
                <Text style={styles.confirmBtnTextDark}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Modal confirmação excluir */}
      <RNModal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Confirmar exclusão</Text>
            <Text style={styles.confirmMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.confirmBold}>excluir</Text> o serviço{" "}
              <Text style={styles.confirmBold}>{deleteTarget?.name}</Text>?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmBtnTextLight}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#EEE" }]}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={styles.confirmBtnTextDark}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Modal novo/editar serviço */}
      <RNModal
        visible={modalMode !== null}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalMode === "new" ? "Novo serviço" : "Editar serviço"}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              <Input
                label="Nome"
                placeholder="Nome do serviço"
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                error={errors.name}
              />
              <Input
                label="Descrição"
                placeholder="Descreva o serviço"
                multiline
                value={form.description}
                onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
                error={errors.description}
              />
              <Input
                label="Preço"
                placeholder="0,00"
                keyboardType="numeric"
                value={form.price}
                onChangeText={(v) => setForm((p) => ({ ...p, price: v }))}
                error={errors.price}
              />
              <Input
                label="Duração (minutos)"
                placeholder="Ex: 60"
                keyboardType="numeric"
                value={form.durationMinutes}
                onChangeText={(v) => setForm((p) => ({ ...p, durationMinutes: v }))}
                error={errors.durationMinutes}
              />
              <Input
                label="URL da imagem"
                placeholder="https://..."
                value={form.imageUrl}
                onChangeText={(v) => setForm((p) => ({ ...p, imageUrl: v }))}
              />

              <Text style={styles.sectionTitle}>Imagem</Text>
              <TouchableOpacity style={styles.dashedBox} onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 100, borderRadius: 10 }}
                  />
                ) : (
                  <>
                    <Text style={styles.uploadText}>
                      Fazer upload ou copiar link
                    </Text>
                    <Ionicons
                      name="document-text"
                      size={24}
                      color="#FFD700"
                      style={{ marginTop: 5 }}
                    />
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSave}
              >
                <Text style={styles.submitText}>
                  {modalMode === "new" ? "Salvar" : "Atualizar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </RNModal>

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

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    flex: 1,
    marginLeft: 16,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
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
    marginLeft: 16,
  },

  searchRow: {
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 80,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  dimmed: {
    opacity: 0.4,
  },

  cardImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },

  inactiveBadge: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },

  inactiveBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },

  toggleText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },

  cardDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardActions: {
    flexDirection: "row",
    gap: 6,
  },

  btnEdit: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  btnDelete: {
    width: "35%",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  btnDisabled: {
    backgroundColor: "#CCC",
  },

  btnDeactivate: {
    backgroundColor: "#7291C0",
  },

  btnActivate: {
    backgroundColor: "#54A779",
  },

  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  confirmCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    gap: 16,
  },

  confirmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  confirmMessage: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  confirmBold: {
    fontWeight: "bold",
    color: "#333",
  },

  confirmActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  confirmBtnTextLight: {
    color: "#FFF",
    fontWeight: "600",
  },

  confirmBtnTextDark: {
    color: "#555",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },

  modalScroll: {
    alignItems: "center",
    paddingBottom: 8,
  },

  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 8,
    marginLeft: "5%",
  },

  dashedBox: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderStyle: "dashed",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    width: "90%",
    minHeight: 100,
    justifyContent: "center",
  },

  uploadText: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 14,
  },

  modalActions: {
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
