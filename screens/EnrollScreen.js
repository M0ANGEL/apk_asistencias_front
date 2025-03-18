import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";

const EnrollScreen = ({ navigation }) => {
  const [cedula, setCedula] = useState("");
  const [photo, setPhoto] = useState(null);
  const [estadoFoto, setEstadoFoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    setEstadoFoto(true);
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

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  // const saveUser = async () => {
  //   if (!cedula || !photo) {
  //     Alert.alert('Error', 'Por favor, ingresa tu cédula y toma una foto.');
  //     return;
  //   }

  //   try {
  //     const token = await AsyncStorage.getItem('token'); // Obtener el token guardado
  //     if (!token) {
  //       Alert.alert('Error', 'No se encontró el token de autenticación.');
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append('cedula', cedula);
  //     formData.append('photo', {
  //       uri: photo,
  //       name: `${cedula}.jpg`,
  //       type: 'image/jpeg',
  //     });

  //     const response = await fetch('http://192.168.116.114/backend-marcacion/public/api/enrolar', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${token}`, // Se envía el token en los headers
  //       },
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       Alert.alert('Éxito', 'Usuario enrolado correctamente.');
  //       setCedula('');
  //       setPhoto(null);
  //     } else {
  //       Alert.alert('Error', result.message || 'Hubo un problema al guardar el usuario.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'No se pudo conectar con el servidor.');
  //   }
  // };

  const saveUser = async () => {
    if (!cedula || !photo) {
      Alert.alert("Error", "Por favor, ingresa tu cédula y toma una foto.");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }
  
      const formData = new FormData();
      formData.append("cedula", cedula);
      formData.append("photo", {
        uri: photo,
        name: `${cedula}.jpg`,
        type: "image/jpeg",
      });
  
      const response = await fetch(
        BASE_URL_ASISTENCIAS+"enrolar",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert("Éxito", "Usuario enrolado correctamente.");
        setCedula("");
        setPhoto(null);
      } else {
        if (result.error === "Usuario ya está enrolado") {
          Alert.alert("Usuario ya registrado", "Este usuario ya ha sido enrolado anteriormente.");
        } else if (result.error === "Persona no encontrada") {
          Alert.alert(
            "Persona no encontrada",
            "El usuario no existe. ¿Deseas crearlo?",
            [
              {
                text: "No",
                style: "cancel",
              },
              {
                text: "Sí",
                onPress: () => navigation.navigate("RegistroUsuarioNuevo"),
              },
            ]
          );
        } else {
          Alert.alert("Error", result.error || "Hubo un problema al guardar el usuario.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
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
          onPress={saveUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoboton}>Crear Usuario</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.PadreBoton}>
        <TouchableOpacity
          style={styles.cajaButton}
          onPress={() => navigation.navigate("RegistroUsuario")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoboton}>Marcar Asistencia</Text>
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

export default EnrollScreen;
