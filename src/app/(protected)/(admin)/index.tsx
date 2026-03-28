import { Text, View, StyleSheet, Image } from "react-native";
import { Button } from "@/components/Button";
import { colors } from "@/styles/colors";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { AdminMenu } from "@/components/admin/navigation/AdminMenu"; 
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>

        <Image
                source={require("../../../../assets/images/logo/logo-white.png")}
                style={{
                    width: 301,
                    height: 132,
                    resizeMode: "contain",
                }}
                />

      
      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <Card title="Bem-vindo ao Blink!">
          <Text>Faz o L.</Text>

          <Image
                source={require("../../../../assets/images/logo/logo-black.png")}
                style={{
                    width: 301,
                    height: 132,
                    resizeMode: "contain",
                }}
                />

          <Modal visible={false} onClose={() => {}} title="Exemplo de Modal">
            <Text>Este é um modal de exemplo.</Text>
          </Modal>

          <Button>Clique aqui</Button>
          <Input label="Digite algo" placeholder="Exemplo de Input" />
        </Card>
      </View>

      {/* Menu fixo no final */}
      <AdminMenu />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});