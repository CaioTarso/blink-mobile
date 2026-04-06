import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminBarChart from "@/components/admin/dashboards/BarChart";
import { colors } from "@/styles/colors";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import ServicesDonutChart from "@/components/admin/dashboards/DonutChart";
import { StatsCard } from "@/components/admin/dashboards/StatsCard";
import { TitleBar } from "@/components/admin/dashboards/TitleBar";
import { TopBar } from "@/components/admin/dashboards/TopBar";

export default function Dashboard() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      
      <ScrollView contentContainerStyle={styles.content}>

        <TopBar userName="Daniel Dantas" />

        <TitleBar 
          title="Dashboard"
          subtitle="Visão geral do seu petshop"
          onBackPress={() => console.log("Voltar")}
          style={{ marginBottom: 20 }}
        />

        <StatsCard
          title="Receita"
          value="R$ 1530,00"
          backgroundColor={colors.secondary}
        />

        <StatsCard
          title="Total Clientes"
          value="20"
          backgroundColor={colors.accent}
        />

        <StatsCard
          title="Pets Cadastrados"
          value="32"
          backgroundColor="#8E44AD"
        />  
        
        <StatsCard
          title="Agendamentos no Mês"
          value="38"
        />

        <AdminBarChart />
        <ServicesDonutChart />
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