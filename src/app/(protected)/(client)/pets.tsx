import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { ClientMenu } from "@/components/client/navigation/ClientMenu";
import { ModalNewPet } from "@/components/client/navigation/ModalNewPet";
import { ModalDeletePet } from "@/components/client/navigation/ModalDeletePet";
import { useAuth } from "@/context/AuthContext";
import {
  getPets,
  createPet,
  updatePet,
  deletePet,
} from "@/services/pets";
import type { Pet as ApiPet, PetSpecies } from "@/types/pets";

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

// --- Mapeamento UI ↔ API ---

const speciesMap: Record<PetType, PetSpecies> = {
  Cachorro: "dog",
  Gato: "cat",
  Pássaro: "bird",
  Outro: "other",
};

const speciesReverseMap: Record<string, PetType> = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Pássaro",
  rabbit: "Outro",
  other: "Outro",
};

const sexMap: Record<PetSex, string> = {
  Macho: "male",
  Fêmea: "female",
};

const sexReverseMap: Record<string, PetSex> = {
  male: "Macho",
  female: "Fêmea",
};

function apiPetToLocal(pet: ApiPet): Pet {
  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed ?? "",
    type: speciesReverseMap[pet.species] ?? "Outro",
    weight: pet.weight ?? 0,
    age: pet.years ?? 0,
    sex: sexReverseMap[pet.sex] ?? "Macho",
    notes: pet.notes ?? "",
  };
}


export default function ClientPets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPets();
      setPets(data.map(apiPetToLocal));
    } catch (err) {
      console.warn("Erro ao carregar pets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const payload = {
        client_id: user?.id ?? "",
        name: data.name,
        species: speciesMap[data.type as PetType] ?? "other",
        weight: parseFloat(data.weight) || 0,
        years: parseInt(data.age, 10) || 0,
        breed: data.breed || "",
        sex: sexMap[data.sex as PetSex] ?? "male",
        notes: data.notes ?? "",
      };

      console.log("[PETS] Enviando payload:", JSON.stringify(payload));

      if (editingPet) {
        const updated = await updatePet(editingPet.id, payload);
        setPets((prev) =>
          prev.map((p) => (p.id === editingPet.id ? apiPetToLocal(updated) : p))
        );
      } else {
        const created = await createPet(payload);
        setPets((prev) => [...prev, apiPetToLocal(created)]);
      }

      setModalVisible(false);
      setEditingPet(null);
    } catch (err: any) {
      console.warn("Erro ao salvar pet:", err);
      console.warn("Resposta da API:", JSON.stringify(err.response?.data));
      const msg = err.response?.data?.message || "Erro ao salvar pet. Tente novamente.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPet) return;
    try {
      await deletePet(deletingPet.id);
      setPets((prev) => prev.filter((p) => p.id !== deletingPet.id));
    } catch (err) {
      console.warn("Erro ao excluir pet:", err);
      alert("Erro ao excluir pet. Tente novamente.");
    } finally {
      setDeleteVisible(false);
      setDeletingPet(null);
    }
  };

  const renderItem = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardAvatar}>
          <Text style={styles.cardEmoji}>
            {item.type === "Cachorro" ? "🐶" : item.type === "Gato" ? "🐱" : item.type === "Pássaro" ? "🐦" : "🐾"}
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
          <Text style={styles.statValue}>{item.age} {item.age === 1 ? "ano" : "anos"}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sexo</Text>
          <Text style={styles.statValue}>{item.sex}</Text>
        </View>
      </View>

      {item.notes ? (
        <Text style={styles.cardNotes} numberOfLines={2}>{item.notes}</Text>
      ) : null}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingPet(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
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
        <View style={styles.headerTop}>
          <Text style={styles.title}>Meus Pets</Text>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              setEditingPet(null);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.newButtonText}>Novo Pet</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Cadastre e gerencie seus animais de estimação
        </Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.secondary} />
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
            setModalVisible(false);
            setEditingPet(null);
          }}
          onSubmit={handleSubmit}
          editingPet={editingPet}
        />

        <ModalDeletePet
          visible={deleteVisible}
          petName={deletingPet?.name ?? ""}
          onCancel={() => {
            setDeleteVisible(false);
            setDeletingPet(null);
          }}
          onConfirm={handleDelete}
        />
      </View>

      <ClientMenu />
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
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54A779",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  newButtonText: {
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
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
    backgroundColor: "#f5f5f5",
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
    minWidth: 72,
    alignItems: "center",
  },
  typeBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
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
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },
  deleteButton: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5484D",
    borderRadius: 10,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: 13,
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
