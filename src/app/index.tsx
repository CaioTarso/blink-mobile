import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/styles/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Faz o L.</Text>
      <Button>Clique aqui</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
