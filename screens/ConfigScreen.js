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
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { BASE_URL_ASISTENCIAS } from "../services/api";

const ConfigScreen = ({ navigation }) => {
  const [serialTelefono, setSerialTelefono] = useState("Obteniendo serial...");
  const [marcaTelefono, setMarcaTelefono] = useState("Detectando marca...");
  const [activoTelefono, setActivoTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const obtenerInformacionDispositivo = async () => {
      try {
        // 1. Verificar si es un dispositivo físico
        if (!Device.isDevice) {
          const simulatedSerial = "SIMULADOR-" + Math.random().toString(36).substring(2, 8);
          setSerialTelefono(simulatedSerial);
          setMarcaTelefono("SIMULADOR");
          await AsyncStorage.setItem("serialTelefono", simulatedSerial);
          return;
        }

        // 2. Intentar recuperar serial guardado
        const storedSerial = await AsyncStorage.getItem("serialTelefono");
        if (storedSerial) {
          setSerialTelefono(storedSerial);
          
          // Intentar recuperar marca guardada si existe
          const storedBrand = await AsyncStorage.getItem("@marcaTelefono");
          if (storedBrand) {
            setMarcaTelefono(storedBrand);
          }
          return;
        }

        // 3. Generar nuevo serial único si no existe
        let deviceSerial = "";
        
        if (Platform.OS === 'android') {
          deviceSerial = Application.androidId || 
                       `AND-${Device.osBuildId || Math.random().toString(36).substring(2, 10)}`;
        } else {
          deviceSerial = await Application.getIosIdForVendorAsync() || 
                       `IOS-${Math.random().toString(36).substring(2, 10)}`;
        }

        // 4. Formatear serial (ej: "SAM-A12B34C56D")
        const formattedSerial = `${Device.manufacturer?.substring(0, 3).toUpperCase() || "DEV"}-${deviceSerial.substring(0, 9)}`;
        setSerialTelefono(formattedSerial);
        
        // Guardar el serial inmediatamente
        await AsyncStorage.setItem("serialTelefono", formattedSerial);

        // 5. Obtener y guardar marca del dispositivo
        let brand = Device.manufacturer || "Fabricante";
        if (Platform.OS === 'ios') {
          brand = Device.modelName?.includes('iPhone') ? 'Apple' : brand;
        }
        setMarcaTelefono(brand);
        await AsyncStorage.setItem("@marcaTelefono", brand);

      } catch (error) {
        console.error("Error:", error);
        const fallbackSerial = "ERR-"+Math.random().toString(36).substring(2, 9);
        setSerialTelefono(fallbackSerial);
        setMarcaTelefono("Error");
        await AsyncStorage.setItem("serialTelefono", fallbackSerial);
      }
    };

    obtenerInformacionDispositivo();
  }, []);

  const handleRegister = async () => {
    if (!activoTelefono) {
      Alert.alert("Campo requerido", "Por favor ingrese el número de activo");
      return;
    }

    setLoading(true);

    try {
      // Verificar que tenemos el serial guardado
      const storedSerial = await AsyncStorage.getItem("serialTelefono");
      if (!storedSerial) {
        throw new Error("No se pudo obtener el serial del dispositivo");
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token no disponible");

      const response = await fetch(BASE_URL_ASISTENCIAS + "registrar-telefono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          serial_email: storedSerial,  // Usamos el serial guardado
          marca: marcaTelefono,
          activo: activoTelefono.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en el servidor");

      // Guardar confirmación de registro exitoso
      await AsyncStorage.multiSet([
        ['@dispositivoRegistrado', 'true'],
        ['@ultimoActivoRegistrado', activoTelefono.toUpperCase()]
      ]);
      
      Alert.alert("Registro exitoso", "Dispositivo registrado correctamente");
      navigation.navigate("MenuConfigLogin");

    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", error.message || "Error al registrar dispositivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      
      
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Serial del dispositivo:</Text>
          <TextInput
            style={styles.input}
            value={serialTelefono}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca:</Text>
          <TextInput
            style={styles.input}
            value={marcaTelefono}
            onChangeText={setMarcaTelefono}
            editable={!marcaTelefono.startsWith("Detectando")}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de activo*:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: FA-1234"
            value={activoTelefono}
            onChangeText={setActivoTelefono}
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Dispositivo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfigScreen;