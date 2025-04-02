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
//   Platform
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Device from 'expo-device';
// import * as Application from 'expo-application';
// import * as Crypto from 'expo-crypto';
// import { BASE_URL_ASISTENCIAS } from "../services/api";

// const ConfigScreen = ({ navigation }) => {
//   const [serialTelefono, setSerialTelefono] = useState("Obteniendo serial...");
//   const [marcaTelefono, setMarcaTelefono] = useState("Detectando marca...");
//   const [modeloTelefono, setModeloTelefono] = useState("");
//   const [activoTelefono, setActivoTelefono] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Función mejorada para generar un serial único
//   const generateDeviceSerial = async () => {
//     try {
//       // 1. Recopilar todos los identificadores posibles
//       const deviceInfo = {
//         platform: Platform.OS,
//         androidId: Platform.OS === 'android' ? Application.androidId : null,
//         iosId: Platform.OS === 'ios' ? await Application.getIosIdForVendorAsync() : null,
//         osBuildId: Device.osBuildId,
//         manufacturer: Device.manufacturer,
//         brand: Device.brand,
//         modelName: Device.modelName,
//         deviceName: Device.deviceName,
//         osVersion: Device.osVersion,
//         totalMemory: Device.totalMemory,
//         supportedCpuArch: Device.supportedCpuArchitectures?.join(','),
//         deviceType: Device.deviceType,
//         timestamp: Date.now()
//       };

//       // 2. Crear string única combinando toda la información
//       const uniqueString = JSON.stringify(deviceInfo);
      
//       // 3. Generar hash SHA-256
//       const hash = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         uniqueString
//       );

//       // 4. Formatear serial (ej: "SAM-A1B2C3D4-23")
//       const brandPrefix = deviceInfo.manufacturer 
//         ? deviceInfo.manufacturer.substring(0, 3).toUpperCase() 
//         : "UNK";
      
//       const shortHash = hash.substring(0, 8).toUpperCase();
//       const yearSuffix = new Date().getFullYear().toString().substring(2);
      
//       return `${brandPrefix}-${shortHash}-${yearSuffix}`;
      
//     } catch (error) {
//       console.error("Error generando serial:", error);
//       // Fallback: timestamp + random
//       const timestamp = Date.now().toString(36).toUpperCase();
//       const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
//       return `FLB-${randomStr}-${timestamp.substring(timestamp.length-4)}`;
//     }
//   };

//   useEffect(() => {
//     const setupDeviceInfo = async () => {
//       try {
//         // Verificar si ya tenemos un serial guardado
//         const storedSerial = await AsyncStorage.getItem("serialTelefono");
//         if (storedSerial) {
//           setSerialTelefono(storedSerial);
          
//           // Cargar información adicional si existe
//           const [brand, model] = await Promise.all([
//             AsyncStorage.getItem("@marcaTelefono"),
//             AsyncStorage.getItem("@modeloTelefono")
//           ]);
          
//           if (brand) setMarcaTelefono(brand);
//           if (model) setModeloTelefono(model);
//           return;
//         }

//         // Generar nuevo serial único
//         const newSerial = await generateDeviceSerial();
//         setSerialTelefono(newSerial);
        
//         // Guardar toda la información
//         const brand = Device.manufacturer || "Fabricante desconocido";
//         const model = Device.modelName || "Modelo desconocido";
        
//         await AsyncStorage.multiSet([
//           ['serialTelefono', newSerial],
//           ['@marcaTelefono', brand],
//           ['@modeloTelefono', model]
//         ]);
        
//         setMarcaTelefono(brand);
//         setModeloTelefono(model);

//       } catch (error) {
//         console.error("Error configurando dispositivo:", error);
//         const fallbackSerial = `ERR-${Date.now().toString(36).substring(4, 8).toUpperCase()}`;
//         setSerialTelefono(fallbackSerial);
//         await AsyncStorage.setItem("serialTelefono", fallbackSerial);
//       }
//     };

//     setupDeviceInfo();
//   }, []);

//   const handleRegister = async () => {
//     if (!activoTelefono) {
//       Alert.alert("Campo requerido", "Por favor ingrese el número de activo");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) throw new Error("Token no disponible");

//       const response = await fetch(BASE_URL_ASISTENCIAS + "registrar-telefono", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           serial_email: serialTelefono,
//           marca: marcaTelefono,
//           modelo: modeloTelefono,
//           activo: activoTelefono.toUpperCase(),
//           sistema_operativo: Platform.OS,
//           version_os: Device.osVersion,
//           fecha_registro: new Date().toISOString()
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Error en el registro");
//       }

//       // Marcar dispositivo como registrado
//       await AsyncStorage.multiSet([
//         ['@dispositivoRegistrado', 'true'],
//         ['@ultimoActivoRegistrado', activoTelefono.toUpperCase()],
//         ['@fechaRegistro', new Date().toISOString()]
//       ]);
      
//       Alert.alert(
//         "Registro exitoso", 
//         `Dispositivo registrado correctamente\nSerial: ${serialTelefono}`
//       );
//       navigation.replace("MenuConfigLogin");

//     } catch (error) {
//       console.error("Error en registro:", error);
//       Alert.alert(
//         "Error en registro", 
//         error.message || "No se pudo completar el registro"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require("../assets/logo.png")} style={styles.logo} />
      
//       <View style={styles.card}>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Serial del dispositivo:</Text>
//           <Text style={styles.serialText}>{serialTelefono}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Marca:</Text>
//           <Text style={styles.infoText}>{marcaTelefono}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Modelo:</Text>
//           <Text style={styles.infoText}>{modeloTelefono}</Text>
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Número de activo*:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Ej: FA-1234"
//             value={activoTelefono}
//             onChangeText={setActivoTelefono}
//             autoCapitalize="characters"
//             placeholderTextColor="#999"
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleRegister}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Registrar Dispositivo</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     alignItems: "center",
//     paddingTop: 30,
//     paddingHorizontal: 20,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 25,
//     resizeMode: "contain",
//   },
//   card: {
//     width: "100%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   label: {
//     fontSize: 15,
//     color: "#555",
//     fontWeight: "500",
//     flex: 1,
//   },
//   serialText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#0a2da8",
//     flex: 1,
//     textAlign: "right",
//   },
//   infoText: {
//     fontSize: 15,
//     color: "#333",
//     flex: 1,
//     textAlign: "right",
//   },
//   inputGroup: {
//     marginBottom: 25,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 14,
//     fontSize: 16,
//     backgroundColor: "#fafafa",
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#0a2da8",
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//     shadowColor: "#0a2da8",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonDisabled: {
//     backgroundColor: "#6c757d",
//     shadowOpacity: 0,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default ConfigScreen;

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
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import { BASE_URL_ASISTENCIAS } from "../services/api";

const ConfigScreen = ({ navigation }) => {
  const [serialTelefono, setSerialTelefono] = useState("Obteniendo serial...");
  const [marcaTelefono, setMarcaTelefono] = useState("Detectando marca...");
  const [modeloTelefono, setModeloTelefono] = useState("");
  const [activoTelefono, setActivoTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDeviceSerial = async () => {
    try {
      const deviceInfo = {
        platform: Platform.OS,
        androidId: Platform.OS === 'android' ? Application.androidId : null,
        iosId: Platform.OS === 'ios' ? await Application.getIosIdForVendorAsync() : null,
        osBuildId: Device.osBuildId,
        manufacturer: Device.manufacturer,
        brand: Device.brand,
        modelName: Device.modelName,
        deviceName: Device.deviceName,
        osVersion: Device.osVersion,
        totalMemory: Device.totalMemory,
        supportedCpuArch: Device.supportedCpuArchitectures?.join(','),
        deviceType: Device.deviceType,
        timestamp: Date.now()
      };

      const uniqueString = JSON.stringify(deviceInfo);
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        uniqueString
      );

      const brandPrefix = deviceInfo.manufacturer 
        ? deviceInfo.manufacturer.substring(0, 3).toUpperCase() 
        : "UNK";
      
      const shortHash = hash.substring(0, 8).toUpperCase();
      const yearSuffix = new Date().getFullYear().toString().substring(2);
      
      return `${brandPrefix}-${shortHash}-${yearSuffix}`;
      
    } catch (error) {
      console.error("Error generando serial:", error);
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `FLB-${randomStr}-${timestamp.substring(timestamp.length-4)}`;
    }
  };

  useEffect(() => {
    const setupDeviceInfo = async () => {
      try {
        // Verificar si ya tenemos un serial guardado (de un registro previo)
        const storedSerial = await AsyncStorage.getItem("serialTelefono");
        if (storedSerial) {
          setSerialTelefono(storedSerial);
          
          // Cargar información adicional si existe
          const [brand, model] = await Promise.all([
            AsyncStorage.getItem("@marcaTelefono"),
            AsyncStorage.getItem("@modeloTelefono")
          ]);
          
          if (brand) setMarcaTelefono(brand);
          if (model) setModeloTelefono(model);
          return;
        }

        // Generar nuevo serial único pero NO guardarlo todavía
        const newSerial = await generateDeviceSerial();
        setSerialTelefono(newSerial);
        
        // Mostrar información del dispositivo
        const brand = Device.manufacturer || "Fabricante desconocido";
        const model = Device.modelName || "Modelo desconocido";
        
        setMarcaTelefono(brand);
        setModeloTelefono(model);

      } catch (error) {
        console.error("Error configurando dispositivo:", error);
        const fallbackSerial = `ERR-${Date.now().toString(36).substring(4, 8).toUpperCase()}`;
        setSerialTelefono(fallbackSerial);
      }
    };

    setupDeviceInfo();
  }, []);

  const handleRegister = async () => {
    if (!activoTelefono) {
      Alert.alert("Campo requerido", "Por favor ingrese el número de activo");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token no disponible");

      // Generar serial si no existe (por si acaso)
      let finalSerial = serialTelefono;
      if (serialTelefono === "Obteniendo serial..." || !serialTelefono) {
        finalSerial = await generateDeviceSerial();
        setSerialTelefono(finalSerial);
      }

      const response = await fetch(BASE_URL_ASISTENCIAS + "registrar-telefono", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          serial_email: finalSerial,
          marca: marcaTelefono,
          modelo: modeloTelefono,
          activo: activoTelefono.toUpperCase(),
          sistema_operativo: Platform.OS,
          version_os: Device.osVersion,
          fecha_registro: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      // Guardar toda la información SOLO después de registro exitoso
      const brand = Device.manufacturer || "Fabricante desconocido";
      const model = Device.modelName || "Modelo desconocido";
      
      await AsyncStorage.multiSet([
        ['serialTelefono', finalSerial],
        ['@marcaTelefono', brand],
        ['@modeloTelefono', model],
        ['@dispositivoRegistrado', 'true'],
        ['@ultimoActivoRegistrado', activoTelefono.toUpperCase()],
        ['@fechaRegistro', new Date().toISOString()]
      ]);
      
      Alert.alert(
        "Registro exitoso", 
        `Dispositivo registrado correctamente\nSerial: ${finalSerial}`
      );
      navigation.replace("MenuConfigLogin");

    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert(
        "Error en registro", 
        error.message || "No se pudo completar el registro"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Serial del dispositivo:</Text>
          <Text style={styles.serialText}>{serialTelefono}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.infoText}>{marcaTelefono}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.infoText}>{modeloTelefono}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de activo*:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: FA-1234"
            value={activoTelefono}
            onChangeText={setActivoTelefono}
            autoCapitalize="characters"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Dispositivo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 25,
    resizeMode: "contain",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  serialText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0a2da8",
    flex: 1,
    textAlign: "right",
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  inputGroup: {
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#0a2da8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#0a2da8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfigScreen;