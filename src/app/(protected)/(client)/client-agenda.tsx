import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppointmentsList, Appointment } from "@/components/AppointmentsList";
import { ClientMenu } from "@/components/client/navigation/ClientMenu";
import {
  cancelAppointment,
  listMyAppointments,
} from "@/services/appointments";
import { colors } from "@/styles/colors";

export default function ClientAgenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await listMyAppointments();
      setAppointments(data);
    } catch (e) {
      setError("Não foi possível carregar seus agendamentos.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCancel = async (id: string) => {
    const previous = appointments;
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelado" } : apt))
    );
    try {
      await cancelAppointment(id);
    } catch (e) {
      setAppointments(previous);
      setError("Não foi possível cancelar o agendamento.");
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }

    if (error && appointments.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={styles.centered}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Text style={styles.errorText}>{error}</Text>
        </ScrollView>
      );
    }

    return (
      <AppointmentsList
        appointments={appointments}
        onCancel={handleCancel}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meus Agendamentos</Text>
        <Text style={styles.subtitle}>
          Histórico de todos os seus agendamentos
        </Text>

        {renderBody()}
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

  centered: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  errorText: {
    color: "#E5484D",
    textAlign: "center",
    fontSize: 14,
  },
});

