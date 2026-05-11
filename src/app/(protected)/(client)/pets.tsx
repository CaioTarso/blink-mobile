import { ModalDeletePet } from "@/components/client/navigation/ModalDeletePet";
import { ModalNewPet } from "@/components/client/navigation/ModalNewPet";
import { getMe } from "@/services/auth";
import {
  createPet,
  deletePet,
  getPetsByClient,
  updatePet,
} from "@/services/pets";

import { colors } from "@/styles/colors";
import type { Pet as ApiPet, PetSpecies } from "@/types/pets";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PetType = "Cachorro" | "Gato" | "Pássaro" | "Outro";
type PetSex = "Macho" | "Fêmea";

type Pet = {
  id: string;
  name: string;
  breed: string;
  type: PetType;
  weight: number;
  age: number;
  sex: PetSex;
  notes: string;
};

type PetFormData = {
  name: string;
  breed: string;
  type: PetType;
  weight: string;
  age: string;
  sex: PetSex;
  notes: string;
};

const typeToSpecies: Record<PetType, PetSpecies> = {
  Cachorro: "dog",
  Gato: "cat",
  Pássaro: "bird",
  Outro: "other",
};

const speciesToType: Record<PetSpecies, PetType> = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Pássaro",
  rabbit: "Outro",
  other: "Outro",
};

function apiPetToScreenPet(apiPet: ApiPet): Pet {
  return {
    id: apiPet.id,
    name: apiPet.name,
    breed: apiPet.breed,
    type: speciesToType[apiPet.species] ?? "Outro",
    weight: Number(apiPet.weight),
    age: Number(apiPet.years),
    sex: apiPet.sex as PetSex,
    notes: apiPet.notes,
  };
}

export default function ClientPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);

  async function loadPets() {
    try {
      setLoading(true);

      const user = await getMe();

      if (!user.client_id) {
        Alert.alert("Erro", "Cliente não identificado. Faça login novamente.");
        setPets([]);
        return;
      }

      setClientId(user.client_id);

      const apiPets = await getPetsByClient(user.client_id);

      setPets(apiPets.map(apiPetToScreenPet));
    } catch (error) {
      console.log("Erro ao carregar pets:", error);
      Alert.alert("Erro", "Não foi possível carregar seus pets.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitPet(data: PetFormData) {
    if (!clientId) {
      Alert.alert("Erro", "Cliente não identificado. Faça login novamente.");
      return;
    }

    const weight = Number(data.weight.replace(",", "."));
    const years = Number(data.age);

    if (!data.name.trim()) {
      Alert.alert("Atenção", "Informe o nome do pet.");
      return;
    }

    if (!data.breed.trim()) {
      Alert.alert("Atenção", "Informe a raça do pet.");
      return;
    }

    if (Number.isNaN(weight)) {
      Alert.alert("Atenção", "Informe um peso válido.");
      return;
    }

    if (Number.isNaN(years)) {
      Alert.alert("Atenção", "Informe uma idade válida.");
      return;
    }

    if (!data.notes.trim()) {
      Alert.alert("Atenção", "Informe alguma observação sobre o pet.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        client_id: clientId,
        name: data.name.trim(),
        species: typeToSpecies[data.type],
        weight,
        notes: data.notes.trim(),
        breed: data.breed.trim(),
        years,
        sex: data.sex,
      };

      if (editingPet) {
        const updatedPet = await updatePet(editingPet.id, payload);

        setPets((prev) =>
          prev.map((pet) =>
            pet.id === editingPet.id ? apiPetToScreenPet(updatedPet) : pet
          )
        );

        Alert.alert("Sucesso", "Pet atualizado com sucesso!");
      } else {
        const newPet = await createPet(payload);

        setPets((prev) => [...prev, apiPetToScreenPet(newPet)]);

        Alert.alert("Sucesso", "Pet cadastrado com sucesso!");
      }

      setModalVisible(false);
      setEditingPet(null);
    } catch (error) {
      console.log("Erro ao salvar pet:", error);
      Alert.alert("Erro", "Não foi possível salvar o pet.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPet) {
      return;
    }

    try {
      setSaving(true);

      await deletePet(deletingPet.id);

      setPets((prev) => prev.filter((pet) => pet.id !== deletingPet.id));

      setDeleteVisible(false);
      setDeletingPet(null);

      Alert.alert("Sucesso", "Pet excluído com sucesso!");
    } catch (error) {
      console.log("Erro ao excluir pet:", error);
      Alert.alert("Erro", "Não foi possível excluir o pet.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  const renderItem = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardAvatar}>
          <Text style={styles.cardEmoji}>
            {item.type === "Cachorro"
              ? "🐶"
              : item.type === "Gato"
              ? "🐱"
              : item.type === "Pássaro"
              ? "🐦"
              : "🐾"}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardBreed}>{item.breed}</Text>
        </View>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Peso</Text>
          <Text style={styles.statValue}>{item.weight} kg</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Idade</Text>
          <Text style={styles.statValue}>
            {item.age} {item.age === 1 ? "ano" : "anos"}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sexo</Text>
          <Text style={styles.statValue}>{item.sex}</Text>
        </View>
      </View>

      {item.notes ? (
        <Text style={styles.cardNotes} numberOfLines={2}>
          {item.notes}
        </Text>
      ) : null}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          disabled={saving}
          onPress={() => {
            setEditingPet(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          disabled={saving}
          onPress={() => {
            setDeletingPet(item);
            setDeleteVisible(true);
          }}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Meus Pets</Text>
            <Text style={styles.headerSubtitle}>
              Cadastre e gerencie seus animais de estimação
            </Text>
          </View>

          <TouchableOpacity
            style={styles.newButton}
            disabled={saving}
            onPress={() => {
              setEditingPet(null);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.newButtonText}>Novo Pet</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando pets...</Text>
          </View>
        ) : (
          <FlatList
            data={pets}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🐾</Text>
                <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>
              </View>
            }
          />
        )}

        <ModalNewPet
          visible={modalVisible}
          onClose={() => {
            if (saving) return;

            setModalVisible(false);
            setEditingPet(null);
          }}
          onSubmit={handleSubmitPet}
          editingPet={editingPet}
        />

        <ModalDeletePet
          visible={deleteVisible}
          petName={deletingPet?.name ?? ""}
          onCancel={() => {
            if (saving) return;

            setDeleteVisible(false);
            setDeletingPet(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
    maxWidth: 200,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54A779",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginBottom: 10,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 100,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 12,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.surface || colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  cardBreed: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  cardNotes: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  editButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5484D",
    borderRadius: 10,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#aaa",
    fontSize: 15,
  },
});