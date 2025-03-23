import React, { useEffect, useState } from "react";
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
import * as Location from "expo-location";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";

const SedeRegistro = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [cargandoBodegas, setCargandoBodegas] = useState(true);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
  const [open, setOpen] = useState(false);
  const [bodegas, setBodegas] = useState([]);

  //bodegas
  useEffect(() => {
    const obtenerBodegas = async () => {
      setCargandoBodegas(true);
      try {
        // Obtener el token almacenado
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Error", "No se encontró el token de autenticación.");
          setCargandoBodegas(false);
          return;
        }

        const response = await fetch(BASE_URL_ASISTENCIAS + "bodegas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });

        const data = await response.json();

        if (response.ok) {
          setBodegas(
            data.map((bodega) => ({
              label: bodega.bod_nombre,
              value: bodega.id,
            }))
          );
        } else {
          Alert.alert(
            "Error",
            data.message || "No se pudieron cargar las bodegas"
          );
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo conectar con el servidor");
      }
      setCargandoBodegas(false);
    };

    obtenerBodegas();
  }, []);

  // 📍 Obtener ubicación
  const handleAutoConfig = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se puede acceder a la ubicación.");
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log("Ubicación obtenida:", location.coords);
      Alert.alert(
        "Ubicación",
        `Lat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`
      );
    } catch (error) {
      console.log("Error obteniendo la ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    }
    setLoading(false);
  };

  // 📤 Enviar datos al servidor Laravel
  const handleRegister = async () => {
    if (!bodegaSeleccionada) {
      Alert.alert("Error", "Faltan datos por completar.");
      return;
    }

    setLoading(true);

    try {
      // Recuperar el serial guardado
      const serialGuardado = await AsyncStorage.getItem("serialTelefono");
      const token = await AsyncStorage.getItem("token"); // Recuperar el token

      if (!serialGuardado) {
        Alert.alert("Error", "No se encontró el serial.");
        setLoading(false);
        return;
      }

      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      // Datos a enviar
      const data = {
        serial: serialGuardado,
        bodega_id: bodegaSeleccionada,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      };

      const response = await fetch(BASE_URL_ASISTENCIAS + "registrar-sede", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en la cabecera
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (response.ok) {
        Alert.alert("Éxito", "La sede se registró exitosamente.");
        setLocation(null);
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
        {cargandoBodegas ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginBottom: 15 }}
          />
        ) : (
          <DropDownPicker
            open={open}
            value={bodegaSeleccionada}
            items={bodegas}
            setOpen={setOpen}
            setValue={setBodegaSeleccionada}
            setItems={setBodegas}
            placeholder="Seleccione una bodega"
            searchable={true} // Permite la búsqueda
            searchPlaceholder="Buscar bodega..."
            containerStyle={{ marginBottom: 15 }}
            disabled={cargandoBodegas}
          />
        )}

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            disabled={loading}
            onPress={handleAutoConfig}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Localización</Text>
            )}
          </TouchableOpacity>
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
              <Text style={styles.textoboton}>Registrar Sede</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: "12%" }}>
          <Text style={{ color: "red" }}>
            La sede se registrara con la ubicacion del telefono actual, si ya
            esta registrada podras modificarla.
          </Text>
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

export default SedeRegistro;
