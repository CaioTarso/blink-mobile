import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/styles/colors";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { ServiceMenu } from "@/components/navigation/service-menu";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      
      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <Card title="Bem-vindo ao Blink!">
          <Text>Faz o L.</Text>

          <Modal visible={false} onClose={() => {}} title="Exemplo de Modal">
            <Text>Este é um modal de exemplo.</Text>
          </Modal>

          <Button>Clique aqui</Button>
          <Input label="Digite algo" placeholder="Exemplo de Input" />
        </Card>
      </View>

      {/* Menu fixo no final */}
    
       <ServiceMenu />

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