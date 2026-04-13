import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { colors } from "@/styles/colors";
import { TitleBar } from "@/components/TitleBar";
import { TopBar } from "@/components/TopBar";
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

export default function StaffHome() {
  const [appointments, setAppointments] = useState(
    staffData.appointments
  );

  const [selectedFilter, setSelectedFilter] =
    useState<DateFilterType>("today");

  function handleChangeStatus(id: string, status: Status) {
    console.log("Atualizando:", id, status);

    // depois entra API aqui
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  }

  function handleFilterChange(
    filter: DateFilterType,
    range: DateRange
  ) {
    setSelectedFilter(filter);

    console.log("Filtrando de:", range.startDate);
    console.log("Até:", range.endDate);

    // depois entra a API dos filtros aqui
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar userName={staffData.user.name} />

        <TitleBar
          title="Agenda"
          subtitle={getFormattedDate()}
          style={{ marginBottom: 20 }}
        />

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
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
});