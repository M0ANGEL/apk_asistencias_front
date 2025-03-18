import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL_ASISTENCIAS } from "../services/api";

export default function UsuariosNoSebthi({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [bodegas, setBodegas] = useState([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoBodegas, setCargandoBodegas] = useState(true);

  useEffect(() => {
    const obtenerBodegas = async () => {
      setCargandoBodegas(true);
      try {
        const response = await fetch(
          BASE_URL_ASISTENCIAS+"bodegas"
        );
        const data = await response.json();
        if (response.ok) {
          setBodegas(
            data.map((bodega) => ({
              label: bodega.bod_nombre,
              value: bodega.id,
            }))
          );
        } else {
          Alert.alert("Error", "No se pudieron cargar las bodegas");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo conectar con el servidor");
      }
      setCargandoBodegas(false);
    };

    obtenerBodegas();
  }, []);

  const handleLogin = async () => {
    if (!nombre || !cedula || !bodegaSeleccionada) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(
        BASE_URL_ASISTENCIAS+"usuariosNoSebthi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ nombre, cedula, bodega_id: bodegaSeleccionada }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert("Error", data.message || "Ocurrió un error al registrar el usuario");
      } else {
        Alert.alert("Éxito", "Usuario creado correctamente", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Enrolar"), 
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  
    setLoading(false);
  };
  
  return (
    <View style={styles.padre}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.profile} />
      </View>
      <View style={styles.tarjeta}>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Nombre Completo"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Cédula"
            style={styles.input}
            value={cedula}
            onChangeText={(text) => setCedula(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>

        {cargandoBodegas ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginBottom: 15 }}
          />
        ) : (
          <DropDownPicker
            open={open}
            value={bodegaSeleccionada}
            items={bodegas}
            setOpen={setOpen}
            setValue={setBodegaSeleccionada}
            setItems={setBodegas}
            placeholder="Seleccione una bodega"
            searchable={true} // Permite la búsqueda
            searchPlaceholder="Buscar bodega..."
            containerStyle={{ marginBottom: 15 }}
            disabled={cargandoBodegas}
          />
        )}

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoboton}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


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
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
  },
  PadreBoton: {
    alignItems: "center",
  },
  cajaButton: {
    width: 150,
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
  button: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
});
