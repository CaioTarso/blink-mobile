import { colors } from "@/styles/colors";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

export type DateFilterType =
  | "today"
  | "weekend"
  | "last_7_days"
  | "last_30_days";

type Props = {
  selected: DateFilterType;
  onSelect: (filter: DateFilterType, range: DateRange) => void;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getDateRange(filter: DateFilterType): DateRange {
  const today = new Date();

  let startDate = startOfDay(today);
  let endDate = endOfDay(today);

  switch (filter) {
    case "today":
      break;

    case "last_7_days": {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startDate = startOfDay(d);
      break;
    }

    case "last_30_days": {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      startDate = startOfDay(d);
      break;
    }

    case "weekend": {
      const now = new Date();
      const day = now.getDay();

      const saturday = new Date(now);
      saturday.setDate(now.getDate() - day + 6);

      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);

      startDate = startOfDay(saturday);
      endDate = endOfDay(sunday);
      break;
    }
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

export function FilterDate({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const filters: { label: string; value: DateFilterType }[] = [
    { label: "Hoje", value: "today" },
    { label: "Este fim de semana", value: "weekend" },
    { label: "Últimos 7 dias", value: "last_7_days" },
    { label: "Últimos 30 dias", value: "last_30_days" },
  ];

  const selectedLabel =
    filters.find((f) => f.value === selected)?.label || "Hoje";

  function toggleDropdown() {
    LayoutAnimation.easeInEaseOut();
    setOpen((prev) => !prev);
  }

  function handleSelect(filter: DateFilterType) {
    const range = getDateRange(filter);
    onSelect(filter, range);

    LayoutAnimation.easeInEaseOut();
    setOpen(false);
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.dropdown,
          pressed && styles.pressed,
        ]}
        onPress={toggleDropdown}
      >
        <Text style={styles.text}>{selectedLabel}</Text>
        <Text style={styles.icon}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          {filters.map((filter) => {
            const isSelected = selected === filter.value;

            return (
              <Pressable
                key={filter.value}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.selectedOption,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => handleSelect(filter.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {filter.label}
                </Text>

                {isSelected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    alignItems: "center",
  },

  dropdown: {
    width: "95%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  pressed: {
    opacity: 0.7,
  },

  text: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  icon: {
    fontSize: 12,
    color: "#6b7280",
  },

  menu: {
    width: "95%",
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionPressed: {
    backgroundColor: "#f9fafb",
  },

  optionText: {
    fontSize: 14,
    color: "#374151",
  },

  selectedOption: {
    backgroundColor: "#f3f4f6",
  },

  selectedText: {
    color: colors.primary,
    fontWeight: "600",
  },

  check: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});