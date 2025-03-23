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

const ConfigScreen = ({ navigation }) => {
  const [serialTelefono, setSerialTelefono] = useState("");
  const [marcaTelefono, setMarcaTelefono] = useState("");
  const [activoTelefono, setActivoTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  // // ✅ Cargar el serial guardado al iniciar la app
  // useEffect(() => {
  //   const cargarSerialGuardado = async () => {
  //     try {
  //       const serialGuardado = await AsyncStorage.getItem("serialTelefono");
  //       if (serialGuardado) {
  //         setSerialTelefono(serialGuardado);
  //       }
  //     } catch (error) {
  //       console.log("Error al cargar el serial guardado:", error);
  //     }
  //   };
  //   cargarSerialGuardado();
  // }, []);

  // ✅ Guardar el serial en el almacenamiento del teléfono

  const guardarSerial = async (serial) => {
    try {
      await AsyncStorage.setItem("serialTelefono", serial);
    } catch (error) {
      console.log("Error al guardar el serial:", error);
    }
  };

  // 📤 Enviar datos al servidor Laravel
  const handleRegister = async () => {
    if (!serialTelefono || !marcaTelefono || !activoTelefono) {
      Alert.alert("Error", "Faltan datos por completar.");
      return;
    }
  
    setLoading(true);
    const data = {
      serial_email: serialTelefono,
      marca: marcaTelefono,
      activo: activoTelefono,
    };

    const token = await AsyncStorage.getItem("token");

  
    try {
      const response = await fetch(BASE_URL_ASISTENCIAS + "registrar-telefono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Respuesta del servidor:", result);
  
      if (response.ok) { 
        Alert.alert("Éxito", "Teléfono registrado correctamente.");
        guardarSerial(serialTelefono);
        navigation.replace("MenuConfigLogin");
      } else {
        Alert.alert("Error", result.message || "No se pudo registrar.");
      }
    } catch (error) {
      console.log("Error enviando datos:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
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
            placeholder="Serial del teléfono"
            style={{ paddingHorizontal: 15 }}
            value={serialTelefono}
            onChangeText={(text) => {
              setSerialTelefono(text);
              guardarSerial(text); // Guardar el serial en tiempo real
            }}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Marca del teléfono"
            style={{ paddingHorizontal: 15 }}
            value={marcaTelefono}
            onChangeText={setMarcaTelefono}
          />
        </View>

        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Numero activo del teléfono"
            style={{ paddingHorizontal: 15 }}
            value={activoTelefono}
            onChangeText={setActivoTelefono}
          />
        </View>

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            disabled={loading}
            onPress={handleRegister}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Registrar Teléfono</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
});

export default ConfigScreen;
