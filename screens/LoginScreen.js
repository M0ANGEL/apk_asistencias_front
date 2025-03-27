// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   StyleSheet,
//   View,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL_ASISTENCIAS } from "../services/api";

// export default function Login({ navigation }) {
//   const [usuario, setUsuario] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serialTelefono, setSerialTelefono] = useState("");

//   useEffect(() => {
//     const cargarSerialGuardado = async () => {
//       try {
//         const serialGuardado = await AsyncStorage.getItem("serialTelefono");

//         if (!serialGuardado) {
//           Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
//           return;
//         }

//         setSerialTelefono(serialGuardado);
//       } catch (error) {
//         console.log("Error al cargar el serial guardado:", error);
//       }
//     };
//     cargarSerialGuardado();
//   }, []);

//   const handleLogin = async () => {
//     if (!usuario || !password) {
//       Alert.alert("Error", "Por favor ingrese usuario y contraseña");
//       return;
//     }

//     if (!serialTelefono) {
//       Alert.alert("Error", "Teléfono no configurado, comunícate con TI");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Intentar iniciar sesión
//       const response = await fetch(BASE_URL_ASISTENCIAS + "loginMarcacion", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           username: usuario,
//           password: password,
//           serialTelefono,
//         }),
//       });

//       const data = await response.json();

//       if (response.status === 404) {
//         Alert.alert("Error", "Telefono no autorizado, comunícate con TI");
//         return;
//       }

//       if (response.status === 401) {
//         Alert.alert("Error", "Usuario o contraseña incorrectos");
//         return;
//       }

//       if (!response.ok) {
//         Alert.alert("Error", data.message || "Ocurrió un error en el login");
//         return;
//       }

//       await AsyncStorage.setItem("token", data.token);
//       const token = await AsyncStorage.getItem("token");

//       // Validar el teléfono en la base de datos
//       const response2 = await fetch(BASE_URL_ASISTENCIAS + "validarTelefono", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ serialTelefono }),
//       });

//       const sedeData = await response2.json();

//       if (response2.status === 404) {
//         Alert.alert(
//           "Error",
//           sedeData.message ||
//             "No se encontró información de la sede, comunícate con TI"
//         );
//         return;
//       }

//       if (!response2.ok) {
//         Alert.alert("Error", "Error validando el teléfono");
//         return;
//       }

//       // Guardar información de la sede
//       await AsyncStorage.setItem("sedeInfo", JSON.stringify(sedeData));

//       // Mostrar datos en alerta
//       Alert.alert(
//         "Sede Validada",
//         `Latitud: ${sedeData.latitud}\nLongitud: ${
//           sedeData.longitud || "No disponible"
//         }\nSede: ${sedeData.bod_nombre || "No disponible"}`
//       );

//       navigation.replace("Home");
//     } catch (error) {
//       Alert.alert("Error", "Ocurrió un problema al conectar con el servidor");
//     } finally {
//       setLoading(false); // Se ejecuta siempre, sin importar el resultado
//     }
//   };

//   return (
//     <View style={styles.padre}>
//       <View style={styles.configuracion}>
//         <TouchableOpacity onPress={() => navigation.navigate("ConfigLogin")}>
//           <Text style={styles.textoboton}>Configuración</Text>
//         </TouchableOpacity>
//       </View>

//       <View>
//         <Image source={require("../assets/logo.png")} style={styles.profile} />
//       </View>

//       <View style={styles.tarjeta}>
//         <View style={styles.cajatexto}>
//           <TextInput
//             placeholder="Usuario"
//             style={{ paddingHorizontal: 15 }}
//             value={usuario}
//             onChangeText={setUsuario}
//             autoCapitalize="none"
//           />
//         </View>

//         <View style={styles.cajatexto}>
//           <TextInput
//             placeholder="Contraseña"
//             style={{ paddingHorizontal: 15 }}
//             secureTextEntry={true}
//             value={password}
//             onChangeText={setPassword}
//           />
//         </View>

//         <View style={styles.PadreBoton}>
//           <TouchableOpacity
//             style={styles.cajaButton}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.textoboton}>Iniciar Sesión</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         <Text style={{ color: "red", textAlign: "center" }}>
//           {serialTelefono ? serialTelefono : "Sin rerial"}
//         </Text>
//       </View>
//     </View>
//   );
// }

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
//     width: 150,
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
// });

import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL_ASISTENCIAS } from "../services/api";
import { Picker } from "@react-native-picker/picker";

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serialTelefono, setSerialTelefono] = useState("");
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [loginExitoso, setLoginExitoso] = useState(false); // Nuevo estado

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
      <View style={styles.configuracion}>
        <TouchableOpacity onPress={() => navigation.navigate("ConfigLogin")}>
          <Text style={styles.textoboton}>Configuración</Text>
        </TouchableOpacity>
      </View>

      <Image source={require("../assets/image.png")} style={styles.profile} />

      <View style={styles.tarjeta}>
        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Usuario"
            style={{ paddingHorizontal: 15 }}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.cajatexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {!loginExitoso ? (
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
        ) : (
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
                style={styles.cajaButton}
                onPress={handleConfirmSede}
              >
                <Text style={styles.textoboton}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      {/* boton que me muestre el serial en alerta */}
        {/* <Text style={styles.serial}>
          {serialTelefono ? serialTelefono : "Sin serial"}
        </Text>

        <View>
          <Image
            source={require("../assets/image.png")}
            style={styles.profile}
          />
        </View> */}


        <View style={styles.imagenContainer}>
          <Image source={require("../assets/logo.png")} style={styles.ultimaImagen} />
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
    paddingVertical: 10,
    backgroundColor: "#cccccc40",
    borderRadius: 20,
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
  serial: { color: "red", textAlign: "center", marginTop: 10 },
  imagenContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 1,
  },
  ultimaImagen: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },
});
