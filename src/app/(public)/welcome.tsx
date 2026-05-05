import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../../assets/images/login/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topContent}>
          <Text style={styles.text}>Bem-vindo!</Text>

          <Image
            source={require("../../../assets/images/logo/logo-white.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.linkText}>
            Não tem uma conta?{" "}
            <Text onPress={() => router.push("/register")} style={styles.link}>Cadastre-se</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 50,
  },

  topContent: {
    alignItems: "center",
  },

  logo: {
    width: 301,
    height: 132,
  },

  text: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },

  buttons: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  button: {
    backgroundColor: colors.accent,
    width: "70%",
    height: 55,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },

  linkText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});