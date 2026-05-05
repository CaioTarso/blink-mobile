import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { colors } from "@/styles/colors";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  petName: string;
  clientName?: string;
  professional: string;
  status: "agendado" | "cancelado" | "concluído" | "não_comparecimento";
}

interface AppointmentsListProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
  onConfirm?: (id: string) => void;
  onNoShow?: (id: string) => void;
  showClientName?: boolean;
}

const statusConfig = {
  agendado: { label: "Agendado", color: colors.primary },
  concluído: { label: "Concluído", color: "#54A779" },
  cancelado: { label: "Cancelado", color: "#E5484D" },
  não_comparecimento: { label: "Não compareceu", color: "#6B7280" },
};

type ConfirmTarget = {
  id: string;
  service: string;
  petName: string;
  action: "cancelar" | "confirmar" | "não_comparecimento";
};

export function AppointmentsList({
  appointments,
  onCancel,
  onConfirm,
  onNoShow,
  showClientName = false,
}: AppointmentsListProps) {
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToastMessage(""));
      }, 2000);
    });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    if (confirmTarget.action === "cancelar") {
      onCancel(confirmTarget.id);
      showToast("Agendamento cancelado com sucesso!");
    } else if (confirmTarget.action === "confirmar" && onConfirm) {
      onConfirm(confirmTarget.id);
      showToast("Agendamento confirmado com sucesso!");
    } else if (confirmTarget.action === "não_comparecimento" && onNoShow) {
      onNoShow(confirmTarget.id);
      showToast("Marcado como não compareceu!");
    }
    setConfirmTarget(null);
  };

  const actionLabel = {
    cancelar: "cancelar",
    confirmar: "confirmar",
    não_comparecimento: "marcar como não compareceu",
  };

  return (
    <View style={{ flex: 1 }}>
      {toastMessage ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

      <Modal
        visible={!!confirmTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar ação</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja{" "}
              <Text style={styles.modalBold}>
                {confirmTarget ? actionLabel[confirmTarget.action] : ""}
              </Text>{" "}
              o agendamento de{" "}
              <Text style={styles.modalBold}>{confirmTarget?.service}</Text>{" "}
              para{" "}
              <Text style={styles.modalBold}>{confirmTarget?.petName}</Text>?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#54A779" }]}
                onPress={handleConfirm}
              >
                <Text style={styles.modalBtnTextLight}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#EEE" }]}
                onPress={() => setConfirmTarget(null)}
              >
                <Text style={styles.modalBtnTextDark}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const status = statusConfig[item.status];
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateBoxDay}>
                    {item.date.split("/")[0]}
                  </Text>
                  <Text style={styles.dateBoxMonth}>
                    {item.date.split("/")[1]}/{item.date.split("/")[2]}
                  </Text>
                  <Text style={styles.dateBoxTime}>{item.time}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.petName}>Pet: {item.petName}</Text>
                  {showClientName && item.clientName && (
                    <Text style={styles.clientName}>
                      Cliente: {item.clientName}
                    </Text>
                  )}
                  <Text style={styles.professional}>
                    Profissional: {item.professional}
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                  <Text style={styles.statusText}>{status.label}</Text>
                </View>
              </View>

              {item.status === "agendado" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#E5484D" }]}
                    onPress={() =>
                      setConfirmTarget({
                        id: item.id,
                        service: item.service,
                        petName: item.petName,
                        action: "cancelar",
                      })
                    }
                  >
                    <Text style={styles.actionBtnText}>Cancelar</Text>
                  </TouchableOpacity>

                  {onConfirm && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#54A779" }]}
                      onPress={() =>
                        setConfirmTarget({
                          id: item.id,
                          service: item.service,
                          petName: item.petName,
                          action: "confirmar",
                        })
                      }
                    >
                      <Text style={styles.actionBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  )}

                  {onNoShow && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#6B7280" }]}
                      onPress={() =>
                        setConfirmTarget({
                          id: item.id,
                          service: item.service,
                          petName: item.petName,
                          action: "não_comparecimento",
                        })
                      }
                    >
                      <Text style={styles.actionBtnText}>Não veio</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  dateBox: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52,
  },

  dateBoxDay: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 24,
  },

  dateBoxMonth: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.85,
  },

  dateBoxTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginTop: 4,
  },

  cardInfo: {
    flex: 1,
  },

  serviceName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 3,
  },

  petName: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },

  clientName: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },

  professional: {
    fontSize: 12,
    color: "#888",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  toast: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#54A779",
    zIndex: 9999,
  },

  toastText: {
    color: "#FFF",
    fontWeight: "400",
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
