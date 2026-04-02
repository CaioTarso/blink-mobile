import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
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

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string) => {
    setToastMessage(message);

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const handleToggleActive = (id: string, value: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: value } : u))
    );

    showToast(value ? "Usuário ativado com sucesso!" : "Usuário desativado com sucesso!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {toastMessage ? (
        <Animated.View
          style={[
            styles.toast,
            toastMessage === "Usuário ativado com sucesso!"
              ? styles.toastActive
              : styles.toastInactive,
            styles.toastAnimated,
            { opacity: toastOpacity },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(protected)/(admin)")}
        >
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Equipe</Text>
        <Text style={styles.subtitle}>
          Gerencie os profissionais do petshop
        </Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <UserCard
              name={item.name}
              role={item.role}
              active={item.active}
              onEdit={() => console.log("Editar", item.name)}
              onDelete={() => console.log("Excluir", item.name)}
              onToggleActive={(value) => handleToggleActive(item.id, value)}
            />
          )}
        />
      </View>

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

  backButton: {
    marginBottom: 10,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    color: "gray",
  },

  listContent: {
    paddingBottom: 80,
  },

  toast: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
  },

  toastAnimated: {
  },

  toastActive: {
    backgroundColor: "#54A779",
  },

  toastInactive: {
    backgroundColor: "#FB3737",
  },

  toastText: {
    color: "#FFF",
    fontWeight: "400",
  },
});