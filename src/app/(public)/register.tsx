import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/admin/navigation/Input";
import { colors } from "@/styles/colors";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo/logo-black.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Crie sua conta e cuide do seu pet com carinho.
      </Text>

      <Text style={styles.subtitle}>
        Preencha os campos abaixo para se cadastrar.
      </Text>

      <View style={styles.formContainer}>
        <Input
          label="Nome"
          placeholder="Digite seu nome"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Email"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/togoin")}>
          <Text style={styles.linkText}>
            Já tem uma conta?{" "}
            <Text style={styles.link}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

 logo: {
  width: 290,
  height: 95,
  marginLeft: -70,
},
  title: {
    fontSize: 26,
    lineHeight: 34,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
  },

  formContainer: {
    width: "100%",
    marginTop: 12,
  },

  button: {
    width: "100%",
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },

  linkText: {
    width: "100%",
    marginTop: 24,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
});