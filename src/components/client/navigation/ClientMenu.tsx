import React, { useEffect, useRef } from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Animated } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ACTIVE_COLOR = "#FFA600";
const INACTIVE_COLOR = "#555";

function MenuItem({
  icon,
  iconActive,
  active,
  onPress,
}: {
  icon: string;
  iconActive: string;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(active ? 1.15 : 1)).current;
  const bgOpacity = useRef(new Animated.Value(active ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: active ? 1.15 : 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.timing(bgOpacity, {
        toValue: active ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.8,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.item, { transform: [{ scale: pressScale }] }]}>
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale }] }]}>
          <Animated.View style={[styles.activeBg, { opacity: bgOpacity }]} />
          <Ionicons
            name={(active ? iconActive : icon) as any}
            size={24}
            color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export function ClientMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const isPets = pathname.includes("pets");
  const isBooking = pathname.includes("booking");
  const isAgenda = pathname.includes("client-agenda");
  const isProfile = pathname.includes("client-profile");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <MenuItem
          icon="paw-outline"
          iconActive="paw"
          active={isPets}
          onPress={() => router.push("/(protected)/(client)/pets")}
        />
        <MenuItem
          icon="calendar-number-outline"
          iconActive="calendar-number"
          active={isBooking}
          onPress={() => router.push("/(protected)/(client)/booking")}
        />
        <MenuItem
          icon="calendar-outline"
          iconActive="calendar"
          active={isAgenda}
          onPress={() => router.push("/(protected)/(client)/client-agenda")}
        />
        <MenuItem
          icon="person-circle-outline"
          iconActive="person-circle"
          active={isProfile}
          onPress={() => router.push("/(protected)/(client)/client-profile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  item: {
    alignItems: "center",
    padding: 4,
  },

  iconWrapper: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  activeBg: {
    position: "absolute",
    width: 44,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF3DC",
  },
});
