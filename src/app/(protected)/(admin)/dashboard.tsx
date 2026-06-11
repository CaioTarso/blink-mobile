import AdminBarChart from "@/components/admin/dashboards/BarChart";
import ServicesDonutChart from "@/components/admin/dashboards/DonutChart";
import { StatsCard } from "@/components/admin/dashboards/StatsCard";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { TitleBar } from "@/components/TitleBar";
import { TopBar } from "@/components/TopBar";
import {
  DashboardMetrics,
  dashboardService,
} from "@/services/dashboard";
import { colors } from "@/styles/colors";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WEEKDAY_LABELS: Record<string, string> = {
  sunday: "Dom",
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
};

const WEEKDAY_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function metricsToBarChart(metrics: DashboardMetrics) {
  return WEEKDAY_ORDER.map((key) => ({
    dia: WEEKDAY_LABELS[key],
    valor: metrics.appointments_by_weekday[
      key as keyof typeof metrics.appointments_by_weekday
    ],
  }));
}

function metricsToStats(metrics: DashboardMetrics) {
  return [
    {
      id: "1",
      title: "Receita Total",
      value: `R$ ${metrics.revenue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      backgroundColor: colors.secondary,
    },
    {
      id: "2",
      title: "Total Clientes",
      value: String(metrics.total_clients),
      backgroundColor: colors.accent,
    },
    {
      id: "3",
      title: "Pets Cadastrados",
      value: String(metrics.total_pets),
      backgroundColor: "#8E44AD",
    },
    {
      id: "4",
      title: "Agendamentos no Mês",
      value: String(metrics.appointments_current_month),
      backgroundColor: colors.primary,
    },
  ];
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (e) {
        setError("Não foi possível carregar os dados do dashboard.");
        console.error("[Dashboard] Erro ao carregar métricas:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar />

        <TitleBar
          title="Dashboard"
          subtitle="Visão geral do seu petshop"
          style={{ marginBottom: 20 }}
        />

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando métricas...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {metrics && !loading && (
          <>
            {metricsToStats(metrics).map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                backgroundColor={stat.backgroundColor}
              />
            ))}

            <AdminBarChart data={metricsToBarChart(metrics)} />

            {/* <ServicesDonutChart data={donutData} /> */}
          </>
        )}
      </ScrollView>

      <AdminMenu />
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
  centered: {
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  loadingText: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.6,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    textAlign: "center",
  },
});
