// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Modal,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL_ASISTENCIAS } from "../services/api";
// import LottieView from "lottie-react-native"; // 🔹 Animación de carga

// const EnrollScreen = ({ navigation, route }) => {
//   const [cedula, setCedula] = useState(route.params?.cedulaPreview || "");
//   const [photo, setPhoto] = useState(null);
//   const [estadoFoto, setEstadoFoto] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(true); // Muestra el modal de instrucciones

//   useEffect(() => {
//     if (!photo) {
//       setTimeout(() => {
//         setShowInstructions(false);
//       }, 3800); // Espera 7 segundos antes de tomar la foto
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
//       cameraType: ImagePicker.CameraType.front, // Cámara frontal
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       setPhoto(result.assets[0].uri);
//     }
//   };

//   const validarCedula = async () => {
//     if (!cedula) {
//       Alert.alert("Error", "Por favor, ingresa tu cédula para validar usuario");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem("token");

//       if (!token) {
//         Alert.alert("Error", "No se encontró el token de autenticación.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("cedula", cedula);

//       const response = await fetch(BASE_URL_ASISTENCIAS + "usuarioCedula", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert("Éxito", result.message); // ✅ Ahora usa result.message correctamente
//       } else {
//         Alert.alert(
//           "Error",
//           result.message || "Hubo un problema al guardar el usuario."
//         );
//       }
//     } catch (error) {
//       Alert.alert("Error", "No se pudo conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveUser = async () => {
//     if (!cedula || !photo) {
//       Alert.alert(
//         "Error",
//         "Por favor, ingresa tu cédula y toma el registro facial."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem("token");
//       const serialGuardado = await AsyncStorage.getItem("serialTelefono");

//       if (!token) {
//         Alert.alert("Error", "No se encontró el token de autenticación.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("cedula", cedula);
//       formData.append("serial", serialGuardado);
//       formData.append("photo", {
//         uri: photo,
//         name: `${cedula}.jpg`,
//         type: "image/jpeg",
//       });

//       const response = await fetch(BASE_URL_ASISTENCIAS + "enrolar", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert("Éxito", "Usuario enrolado correctamente.");
//         setCedula("");
//         setPhoto(null);
//       } else {
//         if (result.error === "Usuario ya está enrolado") {
//           Alert.alert(
//             "Usuario ya registrado",
//             "Este usuario ya ha sido enrolado anteriormente."
//           );
//         } else {
//           Alert.alert(
//             "Error",
//             result.error || "Hubo un problema al guardar el usuario."
//           );
//         }
//       }
//     } catch (error) {
//       Alert.alert("Error", "No se pudo conectar con el servidor.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.padre}>
//       <View>
//         <Image source={require("../assets/logo.png")} style={styles.profile} />
//       </View>

//       {loading ? (
//         <LottieView
//           source={require("../assets/loading.json")} // 🔹 Agrega un archivo Lottie de animación
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       ) : (
//         <>
//           <View style={styles.cajatexto}>
//             <TextInput
//               placeholder="Ingresa tu cédula"
//               style={{ paddingHorizontal: "20%" }}
//               value={cedula}
//               onChangeText={(text) => {
//                 const numericText = text.replace(/[^0-9]/g, "");
//                 setCedula(numericText);
//               }}
//               keyboardType="numeric"
//             />
//           </View>

//           <View style={styles.PadreBoton}>
//             <TouchableOpacity
//               style={styles.cajaButtonValidarCedula}
//               onPress={validarCedula}
//               disabled={loading}
//             >
//               <Text style={styles.textoboton}>Validar cedula</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.PadreBoton}>
//             <TouchableOpacity
//               style={[styles.cajaButton, photo && styles.cajaButtonFotoTomada]}
//               onPress={takePhoto}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text style={styles.textoboton}>
//                   {photo ? "Registro Facial Guardada" : "Registro Facial"}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           <View style={styles.PadreBoton}>
//             <TouchableOpacity
//               style={styles.cajaButtonCrear}
//               onPress={saveUser}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text style={styles.textoboton}>Crear Usuario</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </>
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
//             <Text style={styles.modalList}>🙎‍♂️🙎 Debes haber una sola persona</Text>
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
//   cajatexto: {
//     paddingVertical: 20,
//     backgroundColor: "#cccccc40",
//     borderRadius: 20,
//     marginBottom: 10,
//     marginVertical: 10,
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
//   cajaButtonValidarCedula: {
//     width: 200,
//     backgroundColor: "#f5a21b",
//     borderRadius: 20,
//     paddingVertical: 20,
//     marginTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cajaButtonCrear: {
//     width: 200,
//     backgroundColor: "#0a2da8",
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
//   configuracion: {
//     marginBottom: 20,
//     position: "absolute",
//     top: 20,
//     right: 10,
//     backgroundColor: "#FFC300",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//     elevation: 5,
//   },
//   cajaButtonFotoTomada: {
//     backgroundColor: "#28a745", // Verde cuando la foto ha sido tomada
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

// export default EnrollScreen;

// /* asds */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";
import LottieView from "lottie-react-native";

const EnrollScreen = ({ navigation, route }) => {
  const [cedula, setCedula] = useState(route.params?.cedulaPreview || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Cédula, 2: Validar, 3: Foto, 4: Crear
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (!photo && currentStep === 3) {
      const timeout = setTimeout(() => {
        setShowInstructions(false);
      }, 3800);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
      setCurrentStep(4); // Avanzar al paso de creación
    }
  };

  const validarCedula = async () => {
    if (!cedula) {
      Alert.alert("Error", "Por favor ingresa tu cédula");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }

      const formData = new FormData();
      formData.append("cedula", cedula);

      const response = await fetch(BASE_URL_ASISTENCIAS + "usuarioCedula", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", result.message);
        setIsValidated(true);
        setCurrentStep(3); // Avanzar al paso de foto
      } else {
        Alert.alert("Error", result.message || "Error al validar usuario");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async () => {
    if (!cedula || !photo) {
      Alert.alert("Error", "Datos incompletos");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const serialGuardado = await AsyncStorage.getItem("serialTelefono");

      const formData = new FormData();
      formData.append("cedula", cedula);
      formData.append("serial", serialGuardado);
      formData.append("photo", {
        uri: photo,
        name: `${cedula}.jpg`,
        type: "image/jpeg",
      });

      const response = await fetch(BASE_URL_ASISTENCIAS + "enrolar", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Usuario enrolado correctamente");
        navigation.goBack(); // Regresar después de éxito
      } else {
        Alert.alert("Error", result.error || "Error al crear usuario");
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepsContainer}>
      <View style={[styles.step, currentStep >= 1 && styles.activeStep]}>
        <Text style={styles.stepText}>1</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={[styles.step, currentStep >= 2 && styles.activeStep]}>
        <Text style={styles.stepText}>2</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={[styles.step, currentStep >= 3 && styles.activeStep]}>
        <Text style={styles.stepText}>3</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={[styles.step, currentStep >= 4 && styles.activeStep]}>
        <Text style={styles.stepText}>4</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.padre}>
      <Image source={require("../assets/logo.png")} style={styles.profile} />
      
      {renderStepIndicator()}

      {loading ? (
        <LottieView
          source={require("../assets/loading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      ) : (
        <View style={styles.contentContainer}>
          {/* Paso 1: Ingresar cédula */}
          {currentStep === 1 && (
            <>
              <Text style={styles.stepTitle}>Paso 1: Ingresa tu cédula</Text>
              <View style={styles.cajatexto}>
                <TextInput
                  placeholder="Número de cédula"
                  value={cedula}
                  onChangeText={(text) => setCedula(text.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <TouchableOpacity
                style={styles.cajaButton}
                onPress={() => setCurrentStep(2)}
                disabled={!cedula}
              >
                <Text style={styles.textoboton}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Paso 2: Validar cédula */}
          {currentStep === 2 && (
            <>
              <Text style={styles.stepTitle}>Paso 2: Validar cédula</Text>
              <Text style={styles.cedulaText}>Cédula: {cedula}</Text>
              <TouchableOpacity
                style={styles.cajaButtonValidarCedula}
                onPress={validarCedula}
              >
                <Text style={styles.textoboton}>Validar cédula</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep(1)}
              >
                <Text style={styles.backButtonText}>Regresar</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Paso 3: Tomar foto */}
          {currentStep === 3 && (
            <>
              <Text style={styles.stepTitle}>Paso 3: Registro facial</Text>
              <TouchableOpacity
                style={[styles.cajaButton, photo && styles.cajaButtonFotoTomada]}
                onPress={takePhoto}
              >
                <Text style={styles.textoboton}>
                  {photo ? "Foto tomada" : "Tomar foto"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep(2)}
              >
                <Text style={styles.backButtonText}>Regresar</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Paso 4: Crear usuario */}
          {currentStep === 4 && (
            <>
              <Text style={styles.stepTitle}>Paso 4: Crear usuario</Text>
              {photo && (
                <Image source={{ uri: photo }} style={styles.previewImage} />
              )}
              <TouchableOpacity
                style={styles.cajaButtonCrear}
                onPress={saveUser}
              >
                <Text style={styles.textoboton}>Finalizar registro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep(3)}
              >
                <Text style={styles.backButtonText}>Regresar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Modal de instrucciones para la foto */}
      <Modal visible={showInstructions && currentStep === 3} transparent animationType="fade">
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
            <Text style={styles.modalList}>🙎‍♂️ Solo una persona en la foto</Text>
            <Text style={styles.modalList}>🧢 Sin gorra o sombrero</Text>
            <Text style={styles.modalList}>💡 Buena iluminación</Text>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.skipButtonText}>Entendido</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  profile: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#0a2da8',
  },
  stepText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: '#ccc',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cajatexto: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    textAlign: 'center',
    fontSize: 16,
  },
  cedulaText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  cajaButton: {
    width: '100%',
    backgroundColor: "#0a2da8",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonValidarCedula: {
    width: '100%',
    backgroundColor: "#f5a21b",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonCrear: {
    width: '100%',
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonFotoTomada: {
    backgroundColor: '#28a745',
  },
  textoboton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: '#0a2da8',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
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
    width: '90%',
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
  skipButton: {
    marginTop: 20,
    backgroundColor: '#0a2da8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EnrollScreen;