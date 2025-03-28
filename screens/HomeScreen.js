// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as Location from "expo-location";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MaterialIcons } from "@expo/vector-icons"; // Icono de logout

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);
//   const [sedeLocation, setSedeLocation] = useState(null);
//   const [dentroDelRango, setDentroDelRango] = useState(false);
//   const RANGO_PERMITIDO = 100; // Distancia en metros

//   useEffect(() => {
//     obtenerUbicacion();
//   }, []);

//   // Función para obtener la ubicación actual y compararla con la sede guardada
//   const obtenerUbicacion = async () => {
//     setLoading(true); // Activar animación
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permiso denegado",
//           "Habilita el GPS para marcar asistencia."
//         );
//         setLoading(false);
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setUserLocation(location.coords);

//       const sedeData = await AsyncStorage.getItem("sedeInfo");

//       if (sedeData) {
//         const { latitud, longitud } = JSON.parse(sedeData);
//         const distancia = calcularDistancia(
//           location.coords.latitude,
//           location.coords.longitude,
//           latitud,
//           longitud
//         );

//         setSedeLocation({ latitude: latitud, longitude: longitud });
//         setDentroDelRango(distancia <= RANGO_PERMITIDO);
//       } else {
//         Alert.alert("Error", "No se encontró la ubicación de la sede.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "No se pudo obtener la ubicación.");
//     } finally {
//       setLoading(false); // Desactivar animación
//     }
//   };

//   // Función para calcular la distancia entre dos coordenadas (Fórmula de Haversine)
//   const calcularDistancia = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Radio de la Tierra en metros
//     const rad = Math.PI / 180;
//     const dLat = (lat2 - lat1) * rad;
//     const dLon = (lon2 - lon1) * rad;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * rad) *
//         Math.cos(lat2 * rad) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const handleMarcarAsistencia = () => {
//     setLoading(true);
//     if (!dentroDelRango) {
//       Alert.alert(
//         "Fuera de rango",
//         "No puedes marcar asistencia porque estás fuera del rango permitido."
//       );
//       setLoading(false);
//       return;
//     }
//     navigation.navigate("RegistroUsuario");
//     setLoading(false);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem("token");
//     navigation.replace("Login"); // Redirigir a la pantalla de login
//   };

//   return (
//     <View style={styles.padre}>
//       <TouchableOpacity style={styles.cerrarsesion} onPress={logout}>
//         <MaterialIcons name="logout" size={24} color="red" />
//         <Text style={styles.textoCerrarSesion}>Salir</Text>
//       </TouchableOpacity>

//       <Image source={require("../assets/logo.png")} style={styles.profile} />

//       <View style={styles.tarjeta}>
//         <Boton
//           texto="Enrollar Usuario"
//           onPress={() => navigation.navigate("Enrolar")}
//         />
//         <Boton
//           texto="Marcar asistencia"
//           onPress={handleMarcarAsistencia}
//           loading={loading}
//           color={dentroDelRango ? "#000000" : "#FF0000"}
//         />
//         <View style={styles.PadreBoton}>
//           <TouchableOpacity
//             style={styles.cajaButtonEdit}
//             onPress={() => navigation.navigate("EditarUsuario")}
//           >
//             <Text style={styles.textoboton}>Editar Registros Facial </Text>
//           </TouchableOpacity>
//         </View>
//         <Boton
//           style={{ color: "#f5a21b" }}
//           texto="Configuración"
//           onPress={() => navigation.navigate("ConfigLogin")}
//           color="#0d502c"
//         />
//       </View>
//     </View>
//   );
// };

// // Componente reutilizable para botones
// const Boton = ({ texto, onPress, loading, color = "#000000" }) => (
//   <View style={styles.PadreBoton}>
//     <TouchableOpacity
//       style={[styles.cajaButton, { backgroundColor: color }]}
//       disabled={loading}
//       onPress={onPress}
//     >
//       {loading ? (
//         <ActivityIndicator size="small" color="#fff" />
//       ) : (
//         <Text style={styles.textoboton}>{texto}</Text>
//       )}
//     </TouchableOpacity>
//   </View>
// );

// const styles = StyleSheet.create({
//   padre: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//   },
//   cajaButtonEdit: {
//     width: 200,
//     backgroundColor: "#f5a21b",
//     borderRadius: 20,
//     paddingVertical: 20,
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   profile: {
//     width: 200,
//     height: 200,
//     resizeMode: "contain",
//     marginBottom: 10,
//   },
//   tarjeta: {
//     margin: 20,
//     width: "90%",
//     height: 400,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   PadreBoton: {
//     alignItems: "center",
//   },
//   cajaButton: {
//     width: 200,
//     borderRadius: 20,
//     paddingVertical: 20,
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   textoboton: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   cerrarsesion: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: "red",
//     shadowColor: "black",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
// });

// export default HomeScreen;


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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sedeLocation, setSedeLocation] = useState(null);
  const [dentroDelRango, setDentroDelRango] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const RANGO_PERMITIDO = 100; // Distancia en metros

  // Función para iniciar el seguimiento de ubicación
  const startLocationTracking = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Habilita el GPS para marcar asistencia.");
        return;
      }

      // Obtener la ubicación de la sede primero
      const sedeData = await AsyncStorage.getItem("sedeInfo");
      if (!sedeData) {
        Alert.alert("Error", "No se encontró la ubicación de la sede.");
        return;
      }

      const { latitud, longitud } = JSON.parse(sedeData);
      const sedeLoc = { 
        latitude: parseFloat(latitud), 
        longitude: parseFloat(longitud) 
      };
      setSedeLocation(sedeLoc);

      // Configurar el seguimiento de ubicación en tiempo real
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          const newUserLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
          setUserLocation(newUserLoc);
          
          // Calcular distancia con la sede ya cargada
          const distancia = calcularDistancia(
            newUserLoc.latitude,
            newUserLoc.longitude,
            sedeLoc.latitude,
            sedeLoc.longitude
          );
          setDentroDelRango(distancia <= RANGO_PERMITIDO);
        }
      );

      setLocationSubscription(sub);
    } catch (error) {
      console.error("Error en seguimiento de ubicación:", error);
      Alert.alert("Error", "No se pudo iniciar el seguimiento de ubicación.");
    }
  };

  // Función para detener el seguimiento de ubicación
  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // Efecto para manejar el enfoque/desenfoque de la pantalla
  useFocusEffect(
    React.useCallback(() => {
      startLocationTracking();
      
      return () => {
        stopLocationTracking();
      };
    }, [])
  );

  // Función para calcular la distancia
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
    navigation.replace("Login");
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
          texto={dentroDelRango ? "Marcar asistencia" : "Fuera de rango"}
          onPress={handleMarcarAsistencia}
          loading={loading}
          color={dentroDelRango ? "#000000" : "#FF0000"}
          disabled={!dentroDelRango || loading}
        />
        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButtonEdit}
            onPress={() => navigation.navigate("EditarUsuario")}
          >
            <Text style={styles.textoboton}>Editar Registros Facial</Text>
          </TouchableOpacity>
        </View>
        <Boton
          texto="Configuración"
          onPress={() => navigation.navigate("ConfigLogin")}
          color="#0d502c"
        />
        
        {/* Mostrar estado de ubicación */}
        <View style={styles.locationStatus}>
          <Text style={styles.locationText}>
            Estado: {dentroDelRango ? "✅ Dentro del rango" : "❌ Fuera del rango"}
          </Text>
          {userLocation ? (
            <Text style={styles.locationText}>
              📍 Tu ubicación: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            </Text>
          ) : (
            <Text style={styles.locationText}>📍 Buscando tu ubicación...</Text>
          )}
          {sedeLocation ? (
            <Text style={styles.locationText}>
              🏢 Sede: {sedeLocation.latitude.toFixed(6)}, {sedeLocation.longitude.toFixed(6)}
            </Text>
          ) : (
            <Text style={styles.locationText}>🏢 Cargando ubicación de la sede...</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Componente Boton mejorado
const Boton = ({ texto, onPress, loading, color = "#000000", disabled = false }) => (
  <View style={styles.PadreBoton}>
    <TouchableOpacity
      style={[styles.cajaButton, { 
        backgroundColor: color,
        opacity: disabled ? 0.6 : 1 
      }]}
      disabled={loading || disabled}
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
  cajaButtonEdit: {
    width: 200,
    backgroundColor: "#f5a21b",
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 400,
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
  locationStatus: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  locationText: {
    fontSize: 14,
    color: "#495057",
    marginVertical: 3,
    fontFamily: "System",
  },
  textoCerrarSesion: {
    color: "red",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default HomeScreen;