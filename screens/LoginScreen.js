import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";
import { Picker } from "@react-native-picker/picker";
import LottieView from "lottie-react-native";
import { Alert, Linking } from "react-native";
import * as Application from "expo-application";

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serialTelefono, setSerialTelefono] = useState("");
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [loginExitoso, setLoginExitoso] = useState(false); // Nuevo estado

  const [nuevaVersion, setNuevaVersion] = useState(null);
  const [apkUrl, setApkUrl] = useState("");

  useEffect(() => {
    const verificarActualizacion = async () => {
      try {
        const response = await fetch(BASE_URL_ASISTENCIAS + "Appupdate");
        const data = await response.json();

        const versionLocal = Application.nativeApplicationVersion;
        console.log(
          `Versión actual: ${versionLocal}, Nueva versión: ${data.latest_version}`
        );

        if (data.latest_version !== versionLocal) {
          setNuevaVersion(data.latest_version);
          setApkUrl(data.download_url);
        }
      } catch (error) {
        console.log("Error verificando la versión:", error);
      }
    };

    verificarActualizacion();
  }, []);

  const handleActualizar = () => {
    if (apkUrl) {
      Linking.openURL(apkUrl);
    } else {
      Alert.alert("Error", "No se encontró una URL de actualización.");
    }
  };

  useEffect(() => {
    const cargarSerialGuardado = async () => {
      try {
        const serialGuardado = await AsyncStorage.getItem("serialTelefono");
        if (!serialGuardado) {
          Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
          return;
        }
        setSerialTelefono(serialGuardado);
      } catch (error) {
        console.log("Error al cargar el serial guardado:", error);
      }
    };
    cargarSerialGuardado();
  }, []);

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert("Error", "Por favor ingrese usuario y contraseña");
      return;
    }
    if (!serialTelefono) {
      Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(BASE_URL_ASISTENCIAS + "loginMarcacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: usuario,
          password: password,
          serialTelefono,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Ocurrió un error en el login");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      const token = await AsyncStorage.getItem("token");

      const response2 = await fetch(BASE_URL_ASISTENCIAS + "validarTelefono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serialTelefono }),
      });

      const sedeData = await response2.json();
      if (!response2.ok) {
        Alert.alert("Error", "Error validando el teléfono");
        return;
      }

      setSedes(sedeData.sedes || []);
      setSedeSeleccionada(sedeData.sedes?.[0]?.id || ""); // Selecciona la primera sede
      setLoginExitoso(true); // Habilita la selección de sede
      Alert.alert(
        "Inicio de sesión exitoso",
        "Seleccione su sede antes de continuar."
      );
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSede = async () => {
    if (!sedeSeleccionada) {
      Alert.alert("Error", "Debe seleccionar una sede");
      return;
    }

    // Buscar la sede seleccionada en la lista de sedes
    const sedeInfo = sedes.find((sede) => sede.id === sedeSeleccionada);

    if (!sedeInfo) {
      Alert.alert("Error", "No se encontró la sede seleccionada.");
      return;
    }

    // Guardar solo la información de la sede seleccionada
    await AsyncStorage.setItem("sedeInfo", JSON.stringify(sedeInfo));

    Alert.alert(
      "Sede confirmada.",
      "Se confirmo la sede con la cual se valida la ubicacion para poder  registrar asistencias"
    );
    navigation.replace("Home");
  };

  return (
    <View style={styles.padre}>
      {nuevaVersion ? (
        ""
      ) : (
        <View style={styles.configuracion}>
          <TouchableOpacity onPress={() => navigation.navigate("ConfigLogin")}>
            <Text style={styles.textoboton}>CONFIG</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <Image source={require("../assets/image.png")} style={styles.profile} /> */}

      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../assets/Lo.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Cambiamos View por ImageBackground y añadimos la imagen de fondo */}
      <ImageBackground
        source={require("../assets/LOGO-sebthi-sin-fondo.png")} // Asegúrate de tener esta imagen
        style={styles.tarjeta}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.contenidoTarjeta}>
          <View style={styles.cajatexto}>
            <TextInput
              placeholder="Usuario"
              style={styles.input}
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.cajatexto}>
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {nuevaVersion ? (
            <View style={styles.PadreBoton}>
              <TouchableOpacity
                style={styles.cajaButtonVersion}
                onPress={handleActualizar}
              >
                <Text style={styles.textoboton}>
                  Nueva versión disponible ({nuevaVersion})
                </Text>
              </TouchableOpacity>
            </View>
          ) : loginExitoso ? (
            <>
              <Text style={styles.texto}>Seleccione una sede:</Text>
              <Picker
                selectedValue={sedeSeleccionada}
                onValueChange={setSedeSeleccionada}
                style={styles.picker}
              >
                {sedes.map((sede) => (
                  <Picker.Item
                    key={sede.id}
                    label={sede.bod_nombre}
                    value={sede.id}
                  />
                ))}
              </Picker>
              <View style={styles.PadreBoton}>
                <TouchableOpacity
                  style={styles.cajaButtonConfirmar}
                  onPress={handleConfirmSede}
                >
                  <Text style={styles.textoboton}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.PadreBoton}>
              <TouchableOpacity
                style={styles.cajaButton}
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
          )}

          {/* Texto SEBTHI en la parte inferior */}
          <Text style={styles.brandText}>SEBTHI</Text>
        </View>
      </ImageBackground>
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
    width: 210,
    height: 210,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tarjeta: {
    margin: 20,
    width: "90%",
    height: 400, // Ajusta según necesites
    borderRadius: 20,
    overflow: "hidden", // Importante para que la imagen de fondo no se salga
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semi-transparente
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    opacity: 1,
    margin: 90,
    width: 230,
    height: 230,
    alignSelf: "center",
  },
  contenidoTarjeta: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo semi-transparente
    padding: 20,
    justifyContent: "center",
  },

  input: {
    paddingHorizontal: 15,
  },
  cajatexto: {
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    marginBottom: 10,
    marginVertical: 10,
  },
  texto: {
    paddingHorizontal: 15,
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#cccccc40",
    borderRadius: 20,
    marginBottom: 10,
  },
  PadreBoton: {
    alignItems: "center",
  },
  cajaButtonVersion: {
    width: 250,
    backgroundColor: "#3200eb",
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
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
  cajaButtonConfirmar: {
    width: "100%",
    backgroundColor: "#f5a21b",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textoboton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  configuracion: {
    marginBottom: 20,
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "#f5a21b",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 5,
  },
  serial: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
  },
  loadingContainer: {
    top: 20,
    alignItems: "center",
    width: 210,
    height: 210,
    resizeMode: "contain",
    marginBottom: 15,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  brandText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#f1c840",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
