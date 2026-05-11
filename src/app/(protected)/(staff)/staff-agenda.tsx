import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";

import { colors } from "@/styles/colors";
import { useAuth } from "@/context/AuthContext";
import { AppointmentCard, Status } from "@/components/staff/AppointmentCard";
import { FilterDate, DateFilterType, DateRange } from "@/components/staff/FilterDate";
import {
  getStaffAppointments,
  updateAppointmentStatus,
  Appointment,
  AppointmentStatus,
} from "@/services/appointments";

function getFormattedDate() {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date.charAt(0).toUpperCase() + date.slice(1);
}

function filterByDateRange(appointments: Appointment[], range: DateRange): Appointment[] {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  return appointments.filter((apt) => {
    const date = new Date(apt.start_time);
    return date >= start && date <= end;
  });
}

function formatTime(startTime: string): string {
  const date = new Date(startTime);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function getInitialRange(): DateRange {
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

const statusToApi: Record<Status, AppointmentStatus> = {
  pending: "pending",
  done: "completed",
  cancelled: "cancelled",
  no_show: "no_show",
};

const statusFromApi: Record<AppointmentStatus, Status> = {
  pending: "pending",
  confirmed: "pending",
  completed: "done",
  cancelled: "cancelled",
  no_show: "no_show",
};

export default function StaffAgenda() {
  const { user, logout } = useAuth();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>("today");
  const [dateRange, setDateRange] = useState<DateRange>(getInitialRange());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStaffAppointments(user.id);
      setAllAppointments(data);
      setFilteredAppointments(filterByDateRange(data, dateRange));
    } catch (e) {
      setError("Não foi possível carregar os agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    setFilteredAppointments(filterByDateRange(allAppointments, dateRange));
  }, [dateRange, allAppointments]);

  async function handleChangeStatus(id: string, status: Status) {
    try {
      await updateAppointmentStatus(id, statusToApi[status]);
      setAllAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: statusToApi[status] } : apt
        )
      );
    } catch (e) {
      setError("Não foi possível atualizar o status.");
    }
  }

  function handleFilterChange(filter: DateFilterType, range: DateRange) {
    setSelectedFilter(filter);
    setDateRange(range);
  }

  function handleLogout() {
    setLogoutModal(false);
    logout();
  }

  return (
    <SafeAreaView style={styles.container}>

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
              Tem certeza que deseja{" "}
              <Text style={styles.modalBold}>sair</Text> da sua conta?
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

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name ?? "Staff"}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModal(true)}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Agenda</Text>
        <Text style={styles.subtitle}>{getFormattedDate()}</Text>

        <FilterDate selected={selectedFilter} onSelect={handleFilterChange} />

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        )}

        {!isLoading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!isLoading && !error && filteredAppointments.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhum agendamento para este período.
          </Text>
        )}

        {!isLoading && !error &&
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              id={appointment.id}
              time={formatTime(appointment.start_time)}
              client={appointment.client.name || appointment.client.full_name || "Não informado"}
              pet={appointment.pet.name}
              service={appointment.service?.name ?? "Serviço não informado"}
              status={statusFromApi[appointment.status]}
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
  errorText: {
    color: "#E5484D",
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
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