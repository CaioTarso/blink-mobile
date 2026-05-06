import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";

import { colors } from "@/styles/colors";
import {
  AppointmentCard,
  Status,
} from "@/components/staff/AppointmentCard";
import {
  FilterDate,
  DateFilterType,
  DateRange,
} from "@/components/staff/FilterDate";

function getFormattedDate() {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date.charAt(0).toUpperCase() + date.slice(1);
}

const staffData = {
  user: {
    id: "1",
    name: "Fulano de Tal",
  },
  appointments: [
    {
      id: "1",
      time: "09:00",
      client: "Mário Ayala",
      pet: "Rabito",
      service: "Banho e Tosa",
      status: "pending" as Status,
    },
    {
      id: "2",
      time: "10:30",
      client: "Roberto Carlos",
      pet: "Pandora",
      service: "Consulta Veterinária",
      status: "pending" as Status,
    },
    {
      id: "3",
      time: "14:15",
      client: "Dante Sparda",
      pet: "Safira",
      service: "Consulta Veterinária",
      status: "pending" as Status,
    },
  ],
};

export default function StaffAgenda() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(staffData.appointments);
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>("today");
  const [logoutModal, setLogoutModal] = useState(false);

  function handleChangeStatus(id: string, status: Status) {
    setAppointments((prev) =>
      prev.map((app) => app.id === id ? { ...app, status } : app)
    );
  }

  function handleFilterChange(filter: DateFilterType, range: DateRange) {
    setSelectedFilter(filter);
  }

  function handleLogout() {
    setLogoutModal(false);
    // TODO: conectar com AuthContext
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Modal de confirmação de logout */}
      <Modal
        visible={logoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sair</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja <Text style={styles.modalBold}>sair</Text> da sua conta?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.secondary }]}
                onPress={handleLogout}
              >
                <Text style={styles.modalBtnTextLight}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#EEE" }]}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={styles.modalBtnTextDark}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{staffData.user.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModal(true)}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Agenda</Text>
        <Text style={styles.subtitle}>{getFormattedDate()}</Text>

        <FilterDate
          selected={selectedFilter}
          onSelect={handleFilterChange}
        />

        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            client={appointment.client}
            pet={appointment.pet}
            service={appointment.service}
            status={appointment.status}
            onChangeStatus={handleChangeStatus}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  content: {
    padding: 16,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },

  greeting: {
    fontSize: 13,
    color: "#6b7280",
  },

  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  logoutBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    gap: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  modalBold: {
    fontWeight: "bold",
    color: "#333",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  modalBtnTextLight: {
    color: "#FFF",
    fontWeight: "600",
  },

  modalBtnTextDark: {
    color: "#555",
    fontWeight: "600",
  },
});
