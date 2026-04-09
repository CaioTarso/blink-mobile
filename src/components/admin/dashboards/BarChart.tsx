import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native";

type Props = {
  data: {
    dia: string;
    valor: number;
  }[];
};

export default function DailyAppointmentsChart({ data }: Props) {
  const { width } = useWindowDimensions();

  const chartWidth = Math.min(width - 40, 320);
  const barWidth = Math.min(50, chartWidth / (data.length * 1.4));

  const maxY = Math.max(...data.map((d) => d.valor));
  const domainMax = Math.max(14, maxY);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agendamentos</Text>
      <Text style={styles.title}>por dia</Text>
      <Text style={styles.month}>Mês atual</Text>

      <View style={styles.chartWrapper}>
        <VictoryChart
          width={chartWidth}
          height={200}
          padding={{ top: 10, right: 10, left: 30, bottom: 30 }}
          domain={{ y: [0, domainMax] }}
          domainPadding={{ x: 30 }}
        >
          <VictoryAxis
            tickValues={data.map((d) => d.dia)}
            style={{
              axis: { stroke: "transparent" },
              ticks: { stroke: "transparent" },
              tickLabels: {
                fill: "#111827",
                fontSize: 12,
                fontWeight: "590",
              },
            }}
          />

          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: "#3b82f6", strokeWidth: 0.6 },
              ticks: { stroke: "#3b82f6", strokeWidth: 0.6 },
              tickLabels: {
                fill: "#6b7280",
                fontSize: 11,
              },
            }}
          />

          <VictoryBar
            data={data}
            x="dia"
            y="valor"
            barWidth={barWidth}
            cornerRadius={{ top: 5 }}
            style={{
              data: { fill: "#3CC158" },
            }}
          />
        </VictoryChart>
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
  chartWrapper: {
    width: "100%",
    height: 200,
    justifyContent: "center",
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
});