import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";
import LottieView from "lottie-react-native";

const ConsultarUsuario = ({ navigation, route }) => {
  const [cedula, setCedula] = useState(route.params?.cedulaPreview || "");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Cédula, 2: Validar
  const [isValidated, setIsValidated] = useState(false);

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

      const response = await fetch(BASE_URL_ASISTENCIAS + "ConsultaUsuario", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", result.message);
        setIsValidated(true);
      } else {
        Alert.alert("Error", result.message || "Error al validar usuario");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
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
                  onChangeText={(text) =>
                    setCedula(text.replace(/[^0-9]/g, ""))
                  }
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
        </View>
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
    padding: 20,
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
  profile: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#0a2da8",
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: "#ccc",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  cajatexto: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    textAlign: "center",
    fontSize: 16,
  },
  cedulaText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  cajaButton: {
    width: "100%",
    backgroundColor: "#0a2da8",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonValidarCedula: {
    width: "100%",
    backgroundColor: "#f5a21b",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonCrear: {
    width: "100%",
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  cajaButtonFotoTomada: {
    backgroundColor: "#28a745",
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
    color: "#0a2da8",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
    width: "90%",
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
    backgroundColor: "#0a2da8",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  skipButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ConsultarUsuario;
