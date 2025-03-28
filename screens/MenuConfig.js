import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

const MenuConfigScreen = ({ navigation }) => {
  const [serialRegistrado, setSerialRegistrado] = useState(false);

  useEffect(() => {
    const verificarSerial = async () => {
      const serial = await AsyncStorage.getItem("serialTelefono");
      setSerialRegistrado(!!serial); // Si hay un serial, es true; si no, es false
    };

    verificarSerial();
  }, []);

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.profile} />
      </View>

      <View style={styles.tarjeta}>
        {serialRegistrado ? (
          <View style={styles.PadreBoton}>
            <TouchableOpacity
              style={[styles.cajaButton, { backgroundColor: "green" }]}
              onPress={() =>
                Alert.alert(
                  "El serial ya fue registrado, este no puede ser modificado."
                )
              }
            >
              <Text style={styles.textoboton}>Teléfono Registrado</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.PadreBoton}>
            <TouchableOpacity
              style={[styles.cajaButton, { backgroundColor: "black" }]}
              onPress={() => navigation.navigate("Config")}
            >
              <Text style={styles.textoboton}>Registrar Teléfono a sede</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.PadreBoton}>
          <TouchableOpacity
            style={styles.cajaButton}
            onPress={() => navigation.navigate("CrearSede")}
          >
            <Text style={styles.textoboton}>Registrar Sede con Teléfono</Text>
          </TouchableOpacity>
        </View>


        {serialRegistrado ? (
          <View style={styles.PadreBoton}>
            <Text style={{ color: "blue", marginTop: 30 }}>
              Cierra la APP y entra de nuevo para tomar cambios.
            </Text>
          </View>
        ) : (
          ""
        )}
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
    width: 300,
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
});

export default MenuConfigScreen;
