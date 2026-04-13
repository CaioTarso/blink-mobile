// import { ClientMenu } from "@/components/client/navigation/ClientMenu";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  petName: string;
  clientName: string;
  professional: string;
  status: "agendado" | "cancelado" | "concluído" | "não_comparecimento";
}

// Mock data - substituir pela API quando disponível
const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "26/03/26",
    time: "08:00",
    service: "Banho",
    petName: "MARIA JOAQUINA",
    clientName: "MARIA JOAQUINA",
    professional: "João Silva",
    status: "agendado",
  },
  {
    id: "2",
    date: "26/03/26",
    time: "08:00",
    service: "Banho",
    petName: "MARIA JOAQUINA",
    clientName: "MARIA JOAQUINA",
    professional: "João Silva",
    status: "agendado",
  },
  {
    id: "3",
    date: "26/03/26",
    time: "08:00",
    service: "Banho",
    petName: "MARIA JOAQUINA",
    clientName: "MARIA JOAQUINA",
    professional: "João Silva",
    status: "agendado",
  },
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelado" } : apt,
      ),
    );
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "concluído" } : apt,
      ),
    );
  };

  const handleNoShowAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "não_comparecimento" } : apt,
      ),
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    return (
      <View style={styles.appointmentCard}>
        {/* Top Section - Pet Info and Date/Time */}
        <View style={styles.topSection}>
          {/* Pet Photo and Date */}
          <View style={styles.leftSection}>
            <Image
              source={require("@/assets/images/logo/logo-white.png")}
              style={styles.petPhoto}
            />
            <View style={styles.dateTimeBox}>
              <Text style={styles.dateText}>{appointment.date}</Text>
              <Text style={styles.timeText}>{appointment.time}</Text>
            </View>
          </View>

          {/* Service and Pet Info */}
          <View style={styles.infoSection}>
            <Text style={styles.serviceName}>{appointment.service}</Text>
            <Text style={styles.petName}>{appointment.clientName}</Text>
            <Text style={styles.professional}>
              Profissional: {appointment.professional}
            </Text>
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelAppointment(appointment.id)}
            disabled={appointment.status !== "agendado"}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirmAppointment(appointment.id)}
            disabled={appointment.status !== "agendado"}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.noShowButton}
            onPress={() => handleNoShowAppointment(appointment.id)}
            disabled={appointment.status !== "agendado"}
          >
            <Text style={styles.noShowButtonText}>Não vou poder ir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meus Agendamentos</Text>
          <Text style={styles.subtitle}>
            Histórico de todos os seus agendamentos
          </Text>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsContainer}>
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AppointmentCard appointment={item} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <ClientMenu /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  appointmentsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: "#E3E3E3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: "column",
    gap: 12,
  },
  topSection: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  leftSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  petPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
  },
  dateTimeBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 2,
  },
  infoSection: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 4,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  petName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 2,
  },
  professional: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#1a9e00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  noShowButton: {
    backgroundColor: "#FFA600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  noShowButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cancelActionButton: {
    backgroundColor: "#FCA5A5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0,
  },
  cancelActionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});
