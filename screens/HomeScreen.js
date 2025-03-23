import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sedeLocation, setSedeLocation] = useState(null);
  const [dentroDelRango, setDentroDelRango] = useState(false);
  const RANGO_PERMITIDO = 100; // Distancia en metros

  //validaar ubicacion
  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Habilita el GPS para marcar asistencia."
        );
        return;
      }

      // Obtener la ubicación actual del usuario
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Obtener la ubicación de la sede almacenada en AsyncStorage
      const sedeData = await AsyncStorage.getItem("sedeInfo");
      if (sedeData) {
        const { latitud, longitud } = JSON.parse(sedeData);
        setSedeLocation({ latitude: latitud, longitude: longitud });

        // Calcular distancia entre la ubicación actual y la sede
        const distancia = calcularDistancia(
          location.coords.latitude,
          location.coords.longitude,
          latitud,
          longitud
        );

        setDentroDelRango(distancia <= RANGO_PERMITIDO);
      }
    })();
  }, []);

  // Función para calcular distancia entre dos coordenadas (Haversine Formula)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) *
        Math.cos(lat2 * rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMarcarAsistencia = () => {
    if (!dentroDelRango) {
      Alert.alert(
        "Fuera de rango",
        "No puedes marcar asistencia porque estás fuera del rango permitido de la farmacia."
      );
      return;
    }
    navigation.navigate("RegistroUsuario");
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.profile} />
      </View>

      <View style={styles.tarjeta}>
        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            disabled={loading}
            onPress={() => navigation.navigate("Enrolar")}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Enrollar Usuario</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={[
              styles.cajaButton,
              { backgroundColor: dentroDelRango ? "#000000" : "#FF0000" },
            ]}
            disabled={loading}
            onPress={handleMarcarAsistencia}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Marcar asistencia</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            disabled={loading}
            onPress={() => navigation.navigate("ConfigLogin")}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Configuracion</Text>
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
    width: 200,
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

export default HomeScreen;
