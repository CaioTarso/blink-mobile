import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppointmentsList, Appointment } from "@/components/AppointmentsList";
import { ClientMenu } from "@/components/client/navigation/ClientMenu";

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
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => apt.id === id ? { ...apt, status: "cancelado" } : apt)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meus Agendamentos</Text>
        <Text style={styles.subtitle}>
          Histórico de todos os seus agendamentos
        </Text>

        <AppointmentsList
          appointments={appointments}
          onCancel={handleCancel}
        />
      </View>

      <ClientMenu />
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

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    marginLeft: 16,
  },

  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
    marginLeft: 16,
  },
});
