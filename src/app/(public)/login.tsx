import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Input } from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { getReadableErrorMessage } from "@/utils/errorMessages";

export default function Welcome() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
    } catch (e: unknown) {
      setError(getReadableErrorMessage(e, "Erro ao fazer login. Tente novamente."));
    }
  };

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
            label="E-mail"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            isPassword
            editable={!isLoading}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.push("/recover")}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.linkText}>
              Não tem uma conta?{" "}
              <Text style={styles.link}>Cadastre-se</Text>
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
    alignSelf: "center",
  },

  content: {
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
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

  errorText: {
    color: "#E5484D",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },

  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },

  loginButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "600",
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
