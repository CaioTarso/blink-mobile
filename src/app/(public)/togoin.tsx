import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Input } from "@/components/admin/navigation/Input";
import { linkTo } from "expo-router/build/global-state/routing";

export default function Togoin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 return (
  <View style={styles.container}>
    <Image
      source={require("../../../assets/images/logo/logo-black.png")}
      style={styles.logo}
      resizeMode="contain"
    />

    <View style={styles.content}>
      <Text style={styles.title}>
        <Text style={{ fontWeight: "bold" }}>Cuidado </Text>
        e
        <Text style={{ fontWeight: "bold" }}> carinho </Text>
        para o seu pet em um clique.
      </Text>

      <Text style={styles.subtitle}>
        Insira seu e-mail e senha para fazer login.
      </Text>

      <View style={styles.formContainer}>
        <Input
          label="Email"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <TouchableOpacity>
          <Text onPress={() => router.push("/recover")} style={styles.forgotPasswordText}>
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <TouchableOpacity>
          <Text style={styles.linkText}>
            Não tem uma conta?{" "}
            <Text onPress={() => router.push("/register")} style={styles.link}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#F8F8F8",
  paddingTop: 40,
},


logo: {
  width: 290,
  height: 95,
  marginLeft: -50,
},
content: {
  paddingHorizontal: 24,
},
 title: {
  fontSize: 28,
  lineHeight: 26,
  color: colors.text,
  fontWeight: "500",
  width: "100%",
  marginBottom: 8,
},

  subtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 24,
  },

 formContainer: {
  width: "100%",
  gap: 2,
  marginTop: 12,
},

  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },

  loginButton: {
  backgroundColor:colors.secondary,
  paddingVertical: 15,
  borderRadius: 6,
  alignItems: "center",
  marginTop: 10,
},

  loginButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },

  orText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 14,
  },

  linkText: {
    marginTop: 30,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
});