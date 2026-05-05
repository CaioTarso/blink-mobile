import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BackIcon } from "@/components/icons/back-icon";
import { AppointmentsList, Appointment } from "@/components/AppointmentsList";
import { colors } from "@/styles/colors";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "26/03/26",
    time: "08:00",
    service: "Banho",
    petName: "Maria Joaquina",
    professional: "João Silva",
    status: "agendado",
  },
  {
    id: "2",
    date: "27/03/26",
    time: "10:00",
    service: "Tosa",
    petName: "Bolinha",
    professional: "Maria Souza",
    status: "concluído",
  },
  {
    id: "3",
    date: "28/03/26",
    time: "14:00",
    service: "Consulta Veterinária",
    petName: "Rex",
    professional: "João Silva",
    status: "cancelado",
  },
];

export default function ClientAgenda() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => apt.id === id ? { ...apt, status: "cancelado" } : apt)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Meus Agendamentos</Text>
        </View>

        <Text style={styles.subtitle}>
          Histórico de todos os seus agendamentos
        </Text>

        <AppointmentsList
          appointments={appointments}
          onCancel={handleCancel}
        />
      </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
    marginLeft: 32,
  },
});
