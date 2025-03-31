// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import LottieView from "lottie-react-native";
// import { BASE_URL_ASISTENCIAS } from "../services/api";

// const AttendanceScreen = ({ navigation }) => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(true); // Muestra el modal de instrucciones

//   useEffect(() => {
//     if (!photo) {
//       setTimeout(() => {
//         setShowInstructions(false);
//         takePhoto();
//       }, 3800); // Espera 3 segundos antes de tomar la foto
//     }
//   }, []);

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
//       cameraType: ImagePicker.CameraType.front,
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       const photoUri = result.assets[0].uri;
//       setPhoto(photoUri);
//       validateAttendance(photoUri);
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

//       // console.error("Error:", data);



//       if (data.status === 'success') {
//         setPhoto(null);
//         Alert.alert("Exitos",data.message);
//       } else if (data.error === "Persona  deshabilitada") {
//         Alert.alert("Error", data.message || "No se pudo validar la asistencia, usuario inactivo");
      
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
//       <Image source={require("../assets/logo.png")} style={styles.profile} />

//       {loading ? (
//         <LottieView
//           source={require("../assets/loading.json")}
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       ) : (
//         <TouchableOpacity
//           style={styles.cajaButton}
//           onPress={takePhoto}
//         >
//           <Text style={styles.textoboton}>
//              Registrar nueva asistencia
//           </Text>
//         </TouchableOpacity>
//       )}

//       {/* Modal con instrucciones antes de tomar la foto */}
//       <Modal visible={showInstructions} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <LottieView
//               source={require("../assets/camera-guide.json")} // 🔹 Animación de guía para foto
//               autoPlay
//               loop
//               style={styles.lottie}
//             />
//             <Text style={styles.modalText}>Asegúrate de:</Text>
//             <Text style={styles.modalList}>📸 Acercar tu rostro a la cámara</Text>
//             <Text style={styles.modalList}>🧢 No usar gorra o sombrero</Text>
//             <Text style={styles.modalList}>💡 Buena iluminación</Text>
//           </View>
//         </View>
//       </Modal>
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
//   cajaButton: {
//     width: 200,
//     backgroundColor: "#28a745",
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
//   lottie: {
//     width: 150,
//     height: 150,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 15,
//     alignItems: "center",
//   },
//   modalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalList: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default AttendanceScreen;
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import LottieView from "lottie-react-native";
// import { BASE_URL_ASISTENCIAS } from "../services/api";

// const AttendanceScreen = ({ navigation }) => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para controlar la visualización del éxito

//   useEffect(() => {
//     if (!photo) {
//       setTimeout(() => {
//         setShowInstructions(false);
//         takePhoto();
//       }, 3800);
//     }
//   }, []);

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
//       cameraType: ImagePicker.CameraType.front,
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       const photoUri = result.assets[0].uri;
//       setPhoto(photoUri);
//       validateAttendance(photoUri);
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

//       if (data.status === 'success') {
//         setShowSuccess(true); // Mostrar el estado de éxito
//         setTimeout(() => {
//           setShowSuccess(false);
//           setPhoto(null);
//         }, 3000); // Ocultar después de 3 segundos
//         Alert.alert("Éxito", data.message);
//       } else if (data.error === "Persona deshabilitada") {
//         Alert.alert("Error", data.message || "Usuario inactivo");
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
//       <Image source={require("../assets/logo.png")} style={styles.profile} />

//       {loading ? (
//         <LottieView
//           source={require("../assets/loading.json")}
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       ) : (
//         <TouchableOpacity
//           style={styles.cajaButton}
//           onPress={takePhoto}
//         >
//           <Text style={styles.textoboton}>
//             Registrar nueva asistencia
//           </Text>
//         </TouchableOpacity>
//       )}

//       {/* Mostrar foto en pequeño cuando el registro es exitoso */}
//       {showSuccess && photo && (
//         <View style={styles.photoContainer}>
//           <Image 
//             source={{ uri: photo }} 
//             style={styles.photoPreview}
//           />
//           <Text style={styles.successText}>¡Asistencia registrada!</Text>
//         </View>
//       )}

//       {/* Modal con instrucciones */}
//       <Modal visible={showInstructions} transparent animationType="fade">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <LottieView
//               source={require("../assets/camera-guide.json")}
//               autoPlay
//               loop
//               style={styles.lottie}
//             />
//             <Text style={styles.modalText}>Asegúrate de:</Text>
//             <Text style={styles.modalList}>📸 Acercar tu rostro a la cámara</Text>
//             <Text style={styles.modalList}>🧢 No usar gorra o sombrero</Text>
//             <Text style={styles.modalList}>💡 Buena iluminación</Text>
//           </View>
//         </View>
//       </Modal>
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
//   cajaButton: {
//     width: 200,
//     backgroundColor: "#28a745",
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
//   lottie: {
//     width: 150,
//     height: 150,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 15,
//     alignItems: "center",
//   },
//   modalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalList: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   // Nuevos estilos para la previsualización de foto
//   photoContainer: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     alignItems: 'center',
//   },
//   photoPreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#28a745',
//   },
//   successText: {
//     marginTop: 5,
//     color: '#28a745',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
// });

// export default AttendanceScreen;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { BASE_URL_ASISTENCIAS } from "../services/api";

const AttendanceScreen = ({route, navigation }) => {
  const { bodegaId } = route.params || {};
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!photo) {
      setTimeout(() => {
        setShowInstructions(false);
        takePhoto();
      }, 3800);
    }
  }, []);

  console.log("Bodega ID:", bodegaId); 


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
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const photoUri = result.assets[0].uri;
      setPhoto(photoUri);
      validateAttendance(photoUri);
    }
  };

  const showSuccessAlert = (message, photoUri) => {
    setAlertMessage(message);
    setShowCustomAlert(true);
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

      if (data.status === 'success') {
        showSuccessAlert(data.message, photoUri);
      } else if (data.error === "Persona deshabilitada") {
        Alert.alert("Error", data.message || "Usuario inactivo");
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
          source={require("../assets/loading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      ) : (
        <TouchableOpacity
          style={styles.cajaButton}
          onPress={takePhoto}
        >
          <Text style={styles.textoboton}>
            Registrar nueva asistencia
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal personalizado para mostrar éxito con foto */}
      <Modal 
        transparent 
        visible={showCustomAlert}
        animationType="fade"
        onRequestClose={() => setShowCustomAlert(false)}
      >
        <View style={styles.customAlertContainer}>
          <View style={styles.customAlertContent}>
            <Image 
              source={{ uri: photo }} 
              style={styles.alertImage}
            />
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => {
                setShowCustomAlert(false);
                setPhoto(null);
              }}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal con instrucciones */}
      <Modal visible={showInstructions} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require("../assets/camera-guide.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.modalText}>Asegúrate de:</Text>
            <Text style={styles.modalList}>📸 Acercar tu rostro a la cámara</Text>
            <Text style={styles.modalList}>🧢 No usar gorra o sombrero</Text>
            <Text style={styles.modalList}>💡 Buena iluminación</Text>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#28a745",
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
  lottie: {
    width: 150,
    height: 150,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalList: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Estilos para la alerta personalizada
  customAlertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  customAlertContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  alertImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#28a745',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  alertButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  alertButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;