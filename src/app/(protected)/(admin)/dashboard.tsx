import AdminBarChart from "@/components/admin/dashboards/BarChart";
import ServicesDonutChart from "@/components/admin/dashboards/DonutChart";
import { StatsCard } from "@/components/admin/dashboards/StatsCard";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import { TitleBar } from "@/components/TitleBar";
import { TopBar } from "@/components/TopBar";
import { colors } from "@/styles/colors";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dashboard = {
  user: {
    id: "1",
    name: "Ciclano de Tal",
  },
  stats: [
    {
      id: "1",
      title: "Receita",
      value: "R$ 1530,00",
      backgroundColor: colors.secondary,
    },
    {
      id: "2",
      title: "Total Clientes",
      value: "20",
      backgroundColor: colors.accent,
    },
    {
      id: "3",
      title: "Pets Cadastrados",
      value: "32",
      backgroundColor: "#8E44AD",
    },
    {
      id: "4",
      title: "Agendamentos no Mês",
      value: "38",
    },
  ],
};

const barChartData = [
  { dia: "Dom", valor: 11 },
  { dia: "Seg", valor: 14 },
  { dia: "Ter", valor: 6 },
  { dia: "Qua", valor: 7 },
  { dia: "Qui", valor: 9 },
  { dia: "Sex", valor: 5 },
  { dia: "Sáb", valor: 14 },
];

const donutData = [
  { x: "Banho", y: 50 },
  { x: "Tosa", y: 46 },
  { x: "Consulta", y: 5 },
  { x: "Outros", y: 4 },
];

export default function Dashboard() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar userName={dashboard.user.name} />

        <TitleBar
          title="Dashboard"
          subtitle="Visão geral do seu petshop"
          style={{ marginBottom: 20 }}
        />

        {dashboard.stats.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            backgroundColor={stat.backgroundColor}
          />
        ))}

        <AdminBarChart data={barChartData} />

        <ServicesDonutChart data={donutData} />
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
});
