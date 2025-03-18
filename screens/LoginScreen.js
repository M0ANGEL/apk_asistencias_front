import React, { useState, useEffect } from "react";
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

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serialTelefono, setSerialTelefono] = useState("");

  useEffect(() => {
    const cargarSerialGuardado = async () => {
      try {
        const serialGuardado = await AsyncStorage.getItem("serialTelefono");
        
        if (!serialGuardado) {
          Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
          return;
        }

        setSerialTelefono(serialGuardado);
      } catch (error) {
        console.log("Error al cargar el serial guardado:", error);
      }
    };
    cargarSerialGuardado();
  }, []);

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert("Error", "Por favor ingrese usuario y contraseña");
      return;
    }
  
    if (!serialTelefono) {
      Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
      return;
    }
  
    setLoading(true);
  
    try {
      // Intentar iniciar sesión
      const response = await fetch(BASE_URL_ASISTENCIAS + "loginMarcacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username: usuario, password: password, serialTelefono }),
      });
  
      const data = await response.json();
  
      if (response.status === 404) {
        Alert.alert("Error", "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }
  
      if (!response.ok) {
        Alert.alert("Error", data.message || "Ocurrió un error en el login");
        setLoading(false);
        return;
      }
  
      await AsyncStorage.setItem("token", data.token);
  
      // Validar el teléfono en la base de datos
      const response2 = await fetch(BASE_URL_ASISTENCIAS + "validarTelefono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ serialTelefono }),
      });
  
      const sedeData = await response2.json();
  
      if (response2.status === 404) {
        Alert.alert("Error", sedeData.message || "No se encontró información de la sede, comunicate con TI");
        setLoading(false);
        return;
      }
  
      if (!response2.ok) {
        Alert.alert("Error", "Error validando el teléfono");
        setLoading(false);
        return;
      }
  
      // Guardar información de la sede
      await AsyncStorage.setItem("sedeInfo", JSON.stringify(sedeData));
  
      // Mostrar datos en alerta
      Alert.alert(
        "Sede Validada",
        `Latitud: ${sedeData.latitud}\nLongitud: ${sedeData.longitud || "No disponible"}\nSede: ${sedeData.bod_nombre || "No disponible"}`
      );
  
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al conectar con el servidor");
    }
  
    setLoading(false);
  };
  

  return (
    <View style={styles.padre}>
      <View style={styles.configuracion}>
        <TouchableOpacity onPress={() => navigation.navigate("ConfigLogin")}>
          <Text style={styles.textoboton}>Configuración</Text>
        </TouchableOpacity>
      </View>

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

          <Text style={{ color: "red", textAlign: "center" }}>
            {serialTelefono ? serialTelefono : "Sin rerial"}
          </Text>
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
