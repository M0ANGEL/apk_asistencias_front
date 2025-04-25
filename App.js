import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ConfigLoginScreen from "./screens/ConfigLoginScreen";
import ConfigScreen from "./screens/ConfigScreen";
import EnrollScreen from "./screens/EnrollScreen";
import AttendanceScreen from "./screens/AttendanceScreen";
import UsuariosNoSebthi from "./screens/UsuariosNoSebthi";
import MenuConfigScreen from "./screens/MenuConfig";
import SedeRegistro from "./screens/SedeRegistro";
import EditarUsuarioScreen from "./screens/EditarUsuarioScreen";
import ConsultarUsuario from "./screens/ConsultarUsuario";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ⏳ Mostrar la animación por 3 segundos
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* 🔹 Imagen arriba */}
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        
        {/* 🔹 Animación abajo */}
        <LottieView
          source={require("./assets/loadingInicio.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Login",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Menu principal",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="ConfigLogin"
          component={ConfigLoginScreen}
          options={{
            title: "Configuracion del sistema ",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="MenuConfigLogin"
          component={MenuConfigScreen}
          options={{
            title: "Menu de configuracion ",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="Consultar"
          component={ConsultarUsuario}
          options={{
            title: "Consultar Usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{
            title: "Configuracion telefono",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="CrearSede"
          component={SedeRegistro}
          options={{
            title: "Crear Sedes",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="Enrolar"
          component={EnrollScreen}
          options={{
            title: "Enrolar usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="RegistroUsuario"
          component={AttendanceScreen}
          options={{
            title: "Registro de Asistencias",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
        <Stack.Screen
          name="EditarUsuario"
          component={EditarUsuarioScreen}
          options={{
            title: "Editar Registro Facial",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200, // Ajusta el tamaño del logo
    height: 200,
    marginBottom: 20, // Espacio entre la imagen y la animación
  },
  lottie: {
    width: 150,
    height: 150,
  },
});

