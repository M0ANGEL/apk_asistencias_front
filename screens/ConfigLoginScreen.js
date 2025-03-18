import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";

export default function ConfigLoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert("Error", "Por favor ingrese usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      // **Primera solicitud: Login**
      const response = await fetch(
        BASE_URL_ASISTENCIAS + "loginMarcacionConfi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username: usuario, password: password }),
        }
      );

      if (response.status === 404) {
        Alert.alert("Error", "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        Alert.alert("Error", data.message || "Ocurrió un error en el login");
        setLoading(false);
        return;
      }

      // **Si el login es exitoso, obtenemos el token**
      const data = await response.json();

      if (!data.token) {
        Alert.alert("Error", "No se recibió un token válido");
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem("token", data.token);

      // **Si ambas solicitudes son correctas, navegar a Home**
      navigation.replace("MenuConfigLogin");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.profile} />
      </View>

      <View style={styles.tarjeta}>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Usuario"
            style={{ paddingHorizontal: 15 }}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  profile: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tarjeta: {
    margin: 20,
    width: "90%",
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cajatexto: {
    paddingVertical: 20,
    backgroundColor: "#cccccc40",
    borderRadius: 20,
    marginBottom: 10,
    marginVertical: 10,
  },
  PadreBoton: {
    alignItems: "center",
  },
  cajaButton: {
    width: 150,
    backgroundColor: "#000000",
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textoboton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  configuracion: {
    marginBottom: 20,
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "#FFC300",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 5,
  },
});
