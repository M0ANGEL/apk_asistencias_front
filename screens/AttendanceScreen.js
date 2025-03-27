// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL_ASISTENCIAS } from "../services/api";

// const AttendanceScreen = ({ navigation }) => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const takePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permiso denegado",
//         "Necesitas permitir el acceso a la cámara para tomar una foto."
//       );
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: false,
//       aspect: [4, 3],
//       quality: 1,
//       cameraType: ImagePicker.CameraType.front, // Cámara frontal
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       const photoUri = result.assets[0].uri;
//       setPhoto(photoUri);
//       validateAttendance(photoUri); // 🔹 Llamar a la validación automáticamente
//     }
//   };

//   const validateAttendance = async (photoUri) => {
//     if (!photoUri) {
//       Alert.alert("Error", "No se ha tomado una foto.");
//       return;
//     }

//     setLoading(true);
//     const serialGuardado = await AsyncStorage.getItem("serialTelefono");

//     const formData = new FormData();
//     formData.append("serial", serialGuardado);
//     formData.append("foto", {
//       uri: photoUri,
//       type: "image/jpeg",
//       name: "photo.jpg",
//     });

//     try {
//       const token = await AsyncStorage.getItem("token");

//       const response = await fetch(BASE_URL_ASISTENCIAS + "validarfoto2", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (data.enrolar) {
//         Alert.alert(
//           "Usuario no enrolado",
//           "¿Quieres enrolarte?",
//           [
//             { text: "No", style: "cancel" },
//             {
//               text: "Sí",
//               onPress: () => {
//                 navigation.navigate("Enrolar");
//               },
//             },
//           ],
//           { cancelable: false }
//         );
//       } else if (data.success) {
//         setPhoto(null);
//         Alert.alert("Éxito", " 😁 Asistencia registrada correctamente.");
//       } else {
//         Alert.alert(
//           "Error",
//           data.message || "🫤 La foto no coincide con el usuario registrado."
//         );
//       }
//     } catch (error) {
//       Alert.alert("Error", "Hubo un problema al validar la asistencia.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.padre}>
//       <View>
//         <Image source={require("../assets/logo.png")} style={styles.profile} />
//       </View>

//       <View style={styles.PadreBoton}>
//         <TouchableOpacity
//           style={[styles.cajaButton, photo && styles.cajaButtonFotoTomada]}
//           onPress={takePhoto}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.textoboton}>
//               {photo ? "Foto Guardada" : "Tomar Foto"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   padre: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//   },
//   profile: {
//     width: 200,
//     height: 200,
//     resizeMode: "contain",
//     marginBottom: 10,
//   },
//   PadreBoton: {
//     alignItems: "center",
//   },
//   cajaButton: {
//     width: 200,
//     backgroundColor: "#000000",
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
//   cajaButtonFotoTomada: {
//     backgroundColor: "#28a745", // Verde cuando la foto ha sido tomada
//   },
// });

// export default AttendanceScreen;

//----------------------------------------------------------------
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native"; // 🔹 Animación de carga
import { BASE_URL_ASISTENCIAS } from "../services/api";

const AttendanceScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    takePhoto(); // 🔹 Tomar la foto automáticamente al cargar la pantalla
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas permitir el acceso a la cámara para tomar una foto."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.front, // Cámara frontal
    });

    if (!result.canceled && result.assets?.length > 0) {
      const photoUri = result.assets[0].uri;
      setPhoto(photoUri);
      validateAttendance(photoUri); // 🔹 Validar asistencia automáticamente
    }
  };

  const validateAttendance = async (photoUri) => {
    if (!photoUri) {
      Alert.alert("Error", "No se ha tomado una foto.");
      return;
    }

    setLoading(true);
    const serialGuardado = await AsyncStorage.getItem("serialTelefono");

    const formData = new FormData();
    formData.append("serial", serialGuardado);
    formData.append("foto", {
      uri: photoUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(BASE_URL_ASISTENCIAS + "validarfoto2", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.enrolar) {
        Alert.alert(
          "Usuario no enrolado",
          "¿Quieres enrolarte?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Sí",
              onPress: () => {
                navigation.navigate("Enrolar");
              },
            },
          ],
          { cancelable: false }
        );
      } else if (data.success) {
        setPhoto(null);
        Alert.alert("Éxito", "😁 Asistencia registrada correctamente.");
      } else {
        Alert.alert(
          "Error",
          data.message || "🫤 La foto no coincide con el usuario registrado."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al validar la asistencia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.padre}>
      <Image source={require("../assets/logo.png")} style={styles.profile} />

      {loading ? (
        <LottieView
          source={require("../assets/loading.json")} // 🔹 Agrega un archivo Lottie de animación
          autoPlay
          loop
          style={styles.lottie}
        />
      ) : (
        <TouchableOpacity
          style={[styles.cajaButton, photo && styles.cajaButtonFotoTomada]}
          onPress={takePhoto}
        >
          <Text style={styles.textoboton}>
            {photo ? "Foto Guardada" : "Tomar Foto"}
          </Text>
        </TouchableOpacity>
      )}
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
  cajaButtonFotoTomada: {
    backgroundColor: "#28a745", // Verde cuando la foto ha sido tomada
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

export default AttendanceScreen;
