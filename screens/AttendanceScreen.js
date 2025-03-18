import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";

const AttendanceScreen = () => {
  const [cedula, setCedula] = useState("");
  const [photo, setPhoto] = useState(null);
  const [estadoFoto, setEstadoFoto] = useState(false);
  const [loading, setLoading] = useState(false);

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
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const validateAttendance = async () => {
    if (!cedula || !photo) {
      Alert.alert("Error", "Por favor, ingresa tu cédula y toma una foto.");
      return;
    }

    const formData = new FormData();
    formData.append("cedula", cedula);
    formData.append("foto", {
      uri: photo,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const response = await fetch(
        BASE_URL_ASISTENCIAS+"registrar-marcacion",
        {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Éxito", "Asistencia registrada correctamente.");
      } else {
        Alert.alert(
          "Error",
          data.message || "La foto no coincide con el usuario registrado."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al validar la asistencia.");
    }
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.profile} />
      </View>

      <View style={styles.cajatexto}>
        <TextInput
          placeholder="Ingresa tu cédula"
          style={{ paddingHorizontal: "20%" }}
          value={cedula}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, "");
            setCedula(numericText);
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.PadreBoton}>
        <TouchableOpacity
          style={[styles.cajaButton, photo && styles.cajaButtonFotoTomada]}
          onPress={takePhoto}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoboton}>
              {photo ? "Foto Guardada" : "Tomar Foto"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.PadreBoton}>
        <TouchableOpacity
          style={styles.cajaButtonCrear}
          onPress={validateAttendance}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoboton}>Validar Asistencia</Text>
          )}
        </TouchableOpacity>
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
  cajaButtonCrear: {
    width: 200,
    backgroundColor: "#0a2da8",
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
  cajaButtonFotoTomada: {
    backgroundColor: "#28a745", // Verde cuando la foto ha sido tomada
  },
});

export default AttendanceScreen;
