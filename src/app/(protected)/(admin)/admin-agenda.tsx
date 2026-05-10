import { Appointment, AppointmentsList } from "@/components/AppointmentsList";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import {
  ApiAppointment,
  AppointmentStatus,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "@/services/appointments";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDate(value?: string | null) {
  if (!value) return "--/--/--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--/--/--";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatTime(value?: string | null) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelationName(
  relation?: { name?: string; full_name?: string } | null
) {
  return relation?.name || relation?.full_name || "Não informado";
}

function mapStatusToListStatus(
  status: AppointmentStatus
): Appointment["status"] {
  const statusMap: Record<AppointmentStatus, Appointment["status"]> = {
    pending: "agendado",
    confirmed: "agendado",
    completed: "concluído",
    cancelled: "cancelado",
    no_show: "não_comparecimento",
  };

  return statusMap[status];
}

function mapApiAppointmentToListAppointment(
  appointment: ApiAppointment
): Appointment {
  return {
    id: appointment.id,
    date: formatDate(appointment.scheduled_date || appointment.start_time),
    time: formatTime(appointment.start_time),
    service: "Serviço não informado",
    petName: getRelationName(appointment.pet),
    clientName: getRelationName(appointment.client),
    professional: getRelationName(appointment.staff),
    status: mapStatusToListStatus(appointment.status),
  };
}

export default function AdminAgenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointments();
      setAppointments(data.map(mapApiAppointmentToListAppointment));
    } catch (err) {
      console.warn("Erro ao carregar agendamentos:", err);
      setError("Não foi possível carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updatedAppointment = await updateAppointment(id, { status });

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? mapApiAppointmentToListAppointment(updatedAppointment)
            : appointment
        )
      );
    } catch (err) {
      console.warn("Erro ao atualizar agendamento:", err);
      setError("Não foi possível atualizar o agendamento.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      console.warn("Erro ao excluir agendamento:", err);
      setError("Não foi possível excluir o agendamento.");
    }
  };

  const handleCancel = (id: string) => {
    handleUpdateStatus(id, "cancelled");
  };

  const handleConfirm = (id: string) => {
    handleUpdateStatus(id, "completed");
  };

  const handleNoShow = (id: string) => {
    handleUpdateStatus(id, "no_show");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Agendamentos</Text>
        <Text style={styles.subtitle}>
          Todos os agendamentos do petshop
        </Text>

        {loading ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator />
            <Text style={styles.feedbackText}>Carregando agendamentos...</Text>
          </View>
        ) : error ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              Nenhum agendamento encontrado.
            </Text>
          </View>
        ) : (
          <AppointmentsList
            appointments={appointments}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            onNoShow={handleNoShow}
            onDelete={handleDelete}
            showClientName
          />
        )}
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

  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },

  feedbackText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },

  errorText: {
    fontSize: 14,
    color: "#E5484D",
    textAlign: "center",
    fontWeight: "600",
  },
});
