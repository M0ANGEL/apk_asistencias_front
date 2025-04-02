import axios from "axios";

//pruebas localhost
export const BASE_URL = "http://192.168.1.6/sebthi-backend/public/api/";
export const BASE_URL_ASISTENCIAS = "http://192.168.1.6/backend-marcacion/public/api/";


//rutas pruebas servidor
// export const BASE_URL = "https://farmartltda.com/pruebas/apis/controlacceso-backend/public/api/";
// export const BASE_URL_ASISTENCIAS = "https://farmartltda.com/pruebas/apis/controlacceso-backend/public/api/";


// rutas producion servidor
// export const BASE_URL = "https://farmartltda.com/pruebas/apis/controlacceso-backend/public/api/";
// export const BASE_URL_ASISTENCIAS = "https://farmartltda.com/pruebas/apis/controlacceso-backend/public/api/";


export const sebthi = axios.create({
  baseURL: BASE_URL,
});

export const asistencias = axios.create({
  baseURL: BASE_URL_ASISTENCIAS,
});
