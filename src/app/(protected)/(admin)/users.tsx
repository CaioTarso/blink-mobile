import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { UserCard } from "@/components/admin/UserCard";

// MOCKADO
const userName = [
  { id: "1", name: "João Silva", role: "Admin", active: true },
  { id: "2", name: "Maria Souza", role: "Staff", active: true },
  { id: "3", name: "Carlos Lima", role: "Client", active: false },
];

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState(userName);

  const handleToggleActive = (id: string, value: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: value } : u))
    );

    if (value) {
      alert("Usuário ativado");
    } else {
      alert("Usuário desativado");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(protected)/(admin)")}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Equipe</Text>
        <Text style={styles.subtitle}>
          Gerencie os profissionais do petshop
        </Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <UserCard
              name={item.name}
              role={item.role}
              active={item.active}
              onEdit={() => console.log("Editar", item.name)}
              onDelete={() => console.log("Excluir", item.name)}
              onToggleActive={(value) =>
                handleToggleActive(item.id, value)
              }
            />
          )}
        />
      </View>

      <AdminMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, padding: 20 },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 14, color: "#FFA600", fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 15, color: "gray" },
});