import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";
import { TitleBar } from "@/components/TitleBar";
import { TopBar } from "@/components/TopBar";
import { AppointmentCard } from "@/components/(staff)/AppointmentCard";

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
      client: "Maria Silva",
      pet: "Thor",
      service: "Banho e Tosa",
    },
    {
      id: "2",
      time: "10:30",
      client: "Roberto Carlos",
      pet: "Luna",
      service: "Consulta Veterinária",
    },
  ],
};

export default function StaffHome() {
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

        {staffData.appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            time={appointment.time}
            client={appointment.client}
            pet={appointment.pet}
            service={appointment.service}
            onDone={() => console.log("Concluído", appointment.id)}
            onCancel={() => console.log("Cancelado", appointment.id)}
            onNoShow={() => console.log("Ausente", appointment.id)}
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