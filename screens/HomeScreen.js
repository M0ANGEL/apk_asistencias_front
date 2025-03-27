import React, { useEffect, useState } from "react";
import {
  View,
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
import { MaterialIcons } from "@expo/vector-icons"; // Icono de logout


const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sedeLocation, setSedeLocation] = useState(null);
  const [dentroDelRango, setDentroDelRango] = useState(false);
  const RANGO_PERMITIDO = 100; // Distancia en metros

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  // Función para obtener la ubicación actual y compararla con la sede guardada
  const obtenerUbicacion = async () => {
    setLoading(true); // Activar animación
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Habilita el GPS para marcar asistencia."
        );
        setLoading(false);
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
  
      const sedeData = await AsyncStorage.getItem("sedeInfo");
  
      if (sedeData) {
        const { latitud, longitud } = JSON.parse(sedeData);
        const distancia = calcularDistancia(
          location.coords.latitude,
          location.coords.longitude,
          latitud,
          longitud
        );
  
        setSedeLocation({ latitude: latitud, longitude: longitud });
        setDentroDelRango(distancia <= RANGO_PERMITIDO);
      } else {
        Alert.alert("Error", "No se encontró la ubicación de la sede.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    } finally {
      setLoading(false); // Desactivar animación
    }
  };
  
  // Función para calcular la distancia entre dos coordenadas (Fórmula de Haversine)
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
    setLoading(true);
    if (!dentroDelRango) {
      Alert.alert(
        "Fuera de rango",
        "No puedes marcar asistencia porque estás fuera del rango permitido."
      );
      setLoading(false);
      return;
    }
    navigation.navigate("RegistroUsuario");
    setLoading(false);
  };
  

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login"); // Redirigir a la pantalla de login
  };


  return (
    <View style={styles.padre}>
      <TouchableOpacity style={styles.cerrarsesion} onPress={logout}>
        <MaterialIcons name="logout" size={24} color="red" />
        <Text style={styles.textoCerrarSesion}>Salir</Text>
      </TouchableOpacity>

      <Image source={require("../assets/logo.png")} style={styles.profile} />

      <View style={styles.tarjeta}>
        <Boton
          texto="Enrollar Usuario"
          onPress={() => navigation.navigate("Enrolar")}
        />
        <Boton
          texto="Marcar asistencia"
          onPress={handleMarcarAsistencia}
          loading={loading}
          color={dentroDelRango ? "#000000" : "#FF0000"}
        />
        <Boton style={{color: '#f5a21b'}}
          texto="Configuración"
          onPress={() => navigation.navigate("ConfigLogin")}
          color="#f5a21b"
        />
      </View>
    </View>
  );
};

// Componente reutilizable para botones
const Boton = ({ texto, onPress, loading, color = "#000000" }) => (
  <View style={styles.PadreBoton}>
    <TouchableOpacity
      style={[styles.cajaButton, { backgroundColor: color }]}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.textoboton}>{texto}</Text>
      )}
    </TouchableOpacity>
  </View>
);

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
  PadreBoton: {
    alignItems: "center",
  },
  cajaButton: {
    width: 200,
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
  cerrarsesion: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "red",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default HomeScreen;
