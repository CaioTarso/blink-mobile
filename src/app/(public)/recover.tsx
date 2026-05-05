import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo/logo-black.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Recuperar senha</Text>

      <Text style={styles.subtitle}>
        Informe seu e-mail para receber o link de recuperação.
      </Text>

      <View style={styles.formContainer}>
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: conectar com services/auth.ts
            console.log("recover:", email);
          }}
        >
          <Text style={styles.buttonText}>Enviar link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>
            Voltar para <Text style={styles.link}>Login</Text>
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
    alignSelf: "center",
  },

  title: {
    fontSize: 26,
    lineHeight: 34,
    color: colors.text,
    fontWeight: "bold",
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
