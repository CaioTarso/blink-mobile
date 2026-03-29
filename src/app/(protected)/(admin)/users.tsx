import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AdminMenu } from "@/components/admin/navigation/AdminMenu";

const usersMock = [
  { id: "1", name: "João Silva", role: "Admin" },
  { id: "2", name: "Maria Souza", role: "Staff" },
  { id: "3", name: "Carlos Lima", role: "Client" },
];

export default function UsersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Conteúdo */}
      <View style={styles.content}>
        
        {/* Botão voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(protected)/(admin)")}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Usuários</Text>

        <FlatList
          data={usersMock}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          )}
        />
      </View>

      {/* Menu fixo */}
      <AdminMenu />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  backButton: {
    marginBottom: 10,
  },

  backText: {
    fontSize: 14,
    color: "#FFA600",
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  role: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
});