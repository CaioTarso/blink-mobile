import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { VictoryPie } from "victory-native";

const data = [
  { x: "Banho", y: 50 },
  { x: "Tosa", y: 46 },
  { x: "Consulta", y: 5 },
  { x: "Outros", y: 4 },
];

const colors = ["#FACC15", "#3CC158", "#3B82F6", "#EF4444"];

export default function ServicesDonutChart() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Serviços mais</Text>
      <Text style={styles.title}>populares</Text>
      <Text style={styles.month}>Mês atual</Text>

      <View style={styles.chartRow}>
        {/* Donut */}
        <View style={styles.chartContainer}>
          <VictoryPie
            data={data}
            width={180}
            height={180}
            innerRadius={65}
            padAngle={4}
            cornerRadius={10}
            colorScale={colors}
            labels={() => null}
          />
        </View>

        {/* Legenda */}
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
    width: "90%",
    alignSelf: "center",
  },

  title: {
    fontSize: 28,
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

  chartContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  legend: {
    flex: 1,
    marginLeft: 10,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  legendLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  legendValue: {
    fontSize: 12,
    color: "#111827",
  },
});