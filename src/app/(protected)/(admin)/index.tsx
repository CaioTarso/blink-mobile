import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminBarChart from "@/components/admin/dashboards/BarChart";
import { colors } from "@/styles/colors";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu";
import ServicesDonutChart from "@/components/admin/dashboards/DonutChart";

export default function Dashboard() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      
      <ScrollView contentContainerStyle={styles.content}>
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