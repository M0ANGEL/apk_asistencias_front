import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { BASE_URL_ASISTENCIAS } from "../services/api";

const AttendanceScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  //campos de errores
  const [errorCount, setErrorCount] = useState(0);
  const [showCedulaInput, setShowCedulaInput] = useState(false);
  const [cedula, setCedula] = useState("");

  const opciones = [
    "Entrada Trabajo 💻",
    "Salida Almuerzo 🍴",
    "Entrada Almuerzo 🍴",
    "Salida Trabajo 💻",
  ];

  const opcionNumerica = {
    "Entrada Trabajo 💻": 1,
    "Salida Almuerzo 🍴": 2,
    "Entrada Almuerzo 🍴": 3,
    "Salida Trabajo 💻": 4,
  };

  useEffect(() => {
    if (!photo) {
      setTimeout(() => {
        setShowInstructions(false);
      }, 3800);
    }
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
    if (!photoUri || !selectedOption) {
      Alert.alert(
        "Error",
        "No se ha tomado una foto o no se ha seleccionado una opción."
      );
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
    formData.append("tipo_marcacion", opcionNumerica[selectedOption]);

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

      if (data.status === "success") {
        setErrorCount(0); // ✅ Reinicia el contador
        setShowCedulaInput(false); // Oculta el input de cédula si estaba visible
        setCedula(""); // Limpia la cédula
        showSuccessAlert(data.message, photoUri);
      } else {
        setErrorCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setShowCedulaInput(true);
          }
          return newCount;
        });

        Alert.alert(
          "Error",
          data.message || "🫤 La foto no coincide con el usuario registrado. o usuario no registrado"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al validar la asistencia.");
    } finally {
      setLoading(false);
    }
  };

  //envio si hay errores de cedula
  const sendCedulaManual = async () => {
    setLoading(true);

    if (!cedula || !selectedOption) {
      Alert.alert(
        "Error",
        "Debes ingresar la cédula y seleccionar una opción. "
      );
      return;
    }

    try {
      const token3 = await AsyncStorage.getItem("token");
      const serialGuardado = await AsyncStorage.getItem("serialTelefono");

      const response3 = await fetch(
        BASE_URL_ASISTENCIAS + "ValidarCedulaError",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token3}`,
          },
          body: JSON.stringify({
            cedula,
            tipo_marcacion: opcionNumerica[selectedOption],
            serial: serialGuardado,
          }),
        }
      );

      const data3 = await response3.json();

      if (data3.status === "success") {
        Alert.alert("Éxito", data3.message);
        setErrorCount(0); // Reiniciamos el contador
        setCedula("");
        setShowCedulaInput(false); // Ocultamos el input
      } else if (data3.status === "error") {
        Alert.alert("Error", data3.message || "Usuario inactivo");
      } else {
        Alert.alert("Error", data3.message || "No se pudo validar con cédula.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al validar la cédula.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.padre}>
      <Image source={require("../assets/logo.png")} style={styles.profile} />

      {/* CAMPO DE CÉDULA SI FALLA LA VALIDACIÓN */}
      <>
        {loading && (
          <LottieView
            source={require("../assets/loading.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}

        {!loading && showCedulaInput ? (
          <View style={{ marginTop: 20 }}>
            <TextInput
              placeholder="Ingrese su cédula"
              value={cedula}
              onChangeText={setCedula}
              keyboardType="numeric"
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                width: 250,
                textAlign: "center",
              }}
            />
            <TouchableOpacity
              style={styles.cajaButtonCedula}
              onPress={sendCedulaManual}
            >
              <Text style={styles.textoboton}>Registrar Asistencia</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loading && !showCedulaInput && (
          <TouchableOpacity
            style={[
              styles.cajaButton,
              (!selectedOption || loading) && { backgroundColor: "#ccc" },
            ]}
            onPress={takePhoto}
            disabled={!selectedOption || loading}
          >
            <Text style={styles.textoboton}>Registrar nueva asistencia</Text>
          </TouchableOpacity>
        )}
      </>

      {/* OPCIONES DE ASISTENCIA */}
      <View style={styles.contenidoTarjeta}>
        <View style={styles.opcionesContainer}>
          {opciones.map((opcion, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.opcionButton,
                selectedOption === opcion && styles.opcionButtonSeleccionada,
              ]}
              onPress={() => setSelectedOption(opcion)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.opcionTexto,
                  selectedOption === opcion && styles.opcionTextoSeleccionada,
                  { fontSize: 22 }, // Aumentar el tamaño del texto de las opciones
                ]}
              >
                {opcion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* MODAL DE ÉXITO */}
      <Modal transparent visible={showCustomAlert} animationType="fade">
        <View style={styles.customAlertContainer}>
          <View style={styles.customAlertContent}>
            <Image source={{ uri: photo }} style={styles.alertImage} />
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

      {/* INSTRUCCIONES INICIALES */}
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
            <Text style={styles.modalList}>
              📸 Acercar tu rostro a la cámara
            </Text>
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
  contenidoTarjeta: {
    backgroundColor: "rgb(0, 0, 0)", // Fondo semi-transparente
    padding: 20,
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 15,
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
  cajaButtonCedula: {
    width: 250,
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
  opcionesContainer: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  opcionButton: {
    //opciones de botones de tipo de marcacion
    backgroundColor: "rgb(255, 255, 255)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 5,
  },
  opcionButtonSeleccionada: {
    backgroundColor: "#28a745",
  },
  opcionTexto: {
    color: "#333",
    fontWeight: "bold",
  },
  opcionTextoSeleccionada: {
    color: "#fff",
  },
  customAlertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  customAlertContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  alertImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#28a745",
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
  },
  alertButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  alertButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 300,
    height: 400,
    resizeMode: "contain",
    opacity: 0.6,
  },
});

export default AttendanceScreen;
