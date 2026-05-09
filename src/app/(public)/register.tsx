import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function handleRegister() {
    if (!name || !email || !phone || !address || !password || !passwordConfirmation) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Erro", "As senhas não conferem");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        phone,
        address,
      });
    } catch (error: any) {
      Alert.alert("Erro no cadastro", error.message || "Falha ao registrar");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
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
          editable={!isLoading}
        />

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
          label="Telefone"
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!isLoading}
        />

        <Input
          label="Endereço"
          placeholder="Rua, número, bairro"
          value={address}
          onChangeText={setAddress}
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

        <Input
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          isPassword
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")} disabled={isLoading}>
          <Text style={styles.linkText}>
            Já tem uma conta? <Text style={styles.link}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

  buttonDisabled: {
    opacity: 0.6,
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
