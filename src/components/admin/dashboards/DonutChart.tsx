import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { VictoryPie } from "victory-native";

const screenWidth = Dimensions.get("window").width;

const data = [
  { x: "Banho", y: 50 },
  { x: "Tosa", y: 46 },
  { x: "Consulta", y: 5 },
  { x: "Outros", y: 4 },
];

const colors = ["#FACC15", "#3CC158", "#3B82F6", "#EF4444"];

const responsiveTitleSize = Math.min(Math.max(screenWidth * 0.05, 26), 36);

export default function ServicesDonutChart() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Serviços mais</Text>
      <Text style={styles.title}>populares</Text>
      <Text style={styles.month}>Mês atual</Text>

      <View style={styles.chartRow}>
        <VictoryPie
          data={data}
          width={Math.min(screenWidth * 0.45, 220)}
          height={200}
          innerRadius={70}
          padAngle={2}
          cornerRadius={6}
          colorScale={colors}
          labels={() => null}
        />

        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: colors[index] },
                ]}
              />
              <View>
                <Text style={styles.legendLabel}>{item.x}</Text>
                <Text style={styles.legendValue}>{item.y}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    width: "100%",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 32,
    color: "#000",
  },
  month: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#6b7280",
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  legend: {
    marginLeft: 10,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  legendLabel: {
    fontSize: 14,
    color: "#6b7280",
  },

  legendValue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#111827",
  },
}); 