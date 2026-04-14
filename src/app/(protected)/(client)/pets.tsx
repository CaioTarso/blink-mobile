import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { ModalNewPet } from "@/components/client/navigation/ModalNewPet";
import { ModalDeletePet } from "@/components/client/navigation/ModalDeletePet";

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

const mockPets: Pet[] = [
  {
    id: "1",
    name: "Rex",
    breed: "Golden Retriever",
    type: "Cachorro",
    weight: 30,
    age: 3,
    sex: "Macho",
    notes: "Muito dócil, adora água",
  },
  {
    id: "2",
    name: "Mimi",
    breed: "Golden Retriever",
    type: "Gato",
    weight: 4,
    age: 2,
    sex: "Fêmea",
    notes: "Muito dócil, adora água",
  },
];

export default function ClientPets() {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);

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
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Meus Pets</Text>
            <Text style={styles.headerSubtitle}>
              Cadastre e gerencie seus animais de estimação
            </Text>
          </View>

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

        <ModalNewPet
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingPet(null);
          }}
          onSubmit={(data) => {
            if (editingPet) {
              setPets((prev) =>
                prev.map((p) =>
                  p.id === editingPet.id
                    ? { ...p, ...data, weight: parseFloat(data.weight), age: parseInt(data.age) }
                    : p
                )
              );
            } else {
              setPets((prev) => [
                ...prev,
                { ...data, id: Date.now().toString(), weight: parseFloat(data.weight), age: parseInt(data.age) },
              ]);
            }
            setModalVisible(false);
            setEditingPet(null);
          }}
          editingPet={editingPet}
        />

        <ModalDeletePet
          visible={deleteVisible}
          petName={deletingPet?.name ?? ""}
          onCancel={() => {
            setDeleteVisible(false);
            setDeletingPet(null);
          }}
          onConfirm={() => {
            setPets((prev) => prev.filter((p) => p.id !== deletingPet?.id));
            setDeleteVisible(false);
            setDeletingPet(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
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
    marginTop: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#E0E0E0" ,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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