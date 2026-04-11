import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { colors } from "@/styles/colors";

export type Status = "pending" | "done" | "cancelled" | "no_show";

type Props = {
  id: string;
  time: string;
  client: string;
  pet: string;
  service: string;
  status: Status;
  onChangeStatus: (id: string, status: Status) => void;
};

export function AppointmentCard({
  id,
  time,
  client,
  pet,
  service,
  status,
  onChangeStatus,
}: Props) {
  function handleSelect(newStatus: Status) {
    if (newStatus === status) return; // evita chamada desnecessária
    onChangeStatus(id, newStatus);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.client}>{client}</Text>

      <Text style={styles.info}>Serviço: {service}</Text>
      <Text style={styles.info}>Pet: {pet}</Text>

      <View style={styles.buttonsRow}>
        <View style={styles.button}>
          <Button
            onPress={() => handleSelect("done")}
            backgroundColor={
              status === "done" ? colors.secondary : "#e5e7eb"
            }
            textColor={status === "done" ? "#fff" : "#374151"}
          >
            Concluído
          </Button>
        </View>

        <View style={styles.button}>
          <Button
            onPress={() => handleSelect("cancelled")}
            backgroundColor={
              status === "cancelled" ? "#E5484D" : "#e5e7eb"
            }
            textColor={status === "cancelled" ? "#fff" : "#374151"}
          >
            Cancelado
          </Button>
        </View>

        <View style={styles.button}>
          <Button
            onPress={() => handleSelect("no_show")}
            backgroundColor={
              status === "no_show" ? colors.primary : "#e5e7eb"
            }
            textColor={status === "no_show" ? "#fff" : "#374151"}
          >
            Ausente
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  time: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },

  client: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.text,
  },

  info: {
    color: "#6b7280",
    marginBottom: 4,
  },

  buttonsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  button: {
    flex: 1,
  },
});