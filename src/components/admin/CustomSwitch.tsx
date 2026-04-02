import React, { useRef, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function CustomSwitch({ value, onChange }: Props) {
    const translateX = useRef(new Animated.Value(value ? 22 : 0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
        toValue: value ? 22 : 0,
        useNativeDriver: true,
        friction: 11,
        }).start();
    }, [value]);

    return (
    <TouchableOpacity
        onPress={() => onChange(!value)}
        style={[
        styles.track,
        value ? styles.trackActive : styles.trackInactive,
        ]}
    >
    <Animated.View
        style={[
            styles.thumb,
            {
            transform: [{ translateX }],
            },
        ]}
    />
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    padding: 3,
  },

  trackActive: {
    backgroundColor: "#54A779",
  },

  trackInactive: {
    backgroundColor: "#DDD",
  },

  thumb: {
    width: 16,
    height: 16,
    borderRadius: 11,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  thumbActive: {
    alignSelf: "flex-end",
  },

  thumbInactive: {
    alignSelf: "flex-start",
  },
});