import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ConfigLoginScreen from "./screens/ConfigLoginScreen";
import ConfigScreen from "./screens/ConfigScreen";
import EnrollScreen from "./screens/EnrollScreen";
import AttendanceScreen from "./screens/AttendanceScreen";
import { StyleSheet } from "react-native";
import UsuariosNoSebthi from "./screens/UsuariosNoSebthi";
import MenuConfigScreen from "./screens/MenuConfig";
import SedeRegistro from "./screens/SedeRegistro";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Registro de Asistencias FARMART",
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
            title: "Enrollar usuario",
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
          name="RegistroUsuarioNuevo"
          component={UsuariosNoSebthi}
          options={{
            title: "Registro de Asistencias FARMART",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000000" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
