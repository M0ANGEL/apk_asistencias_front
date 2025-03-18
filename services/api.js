import axios from "axios";

// export const BASE_URL = "http://localhost/sebthi-backend/public/api/";
export const BASE_URL = "http://192.168.76.114/sebthi-backend/public/api/";
export const BASE_URL_ASISTENCIAS = "http://192.168.76.114/backend-marcacion/public/api/";
// export const BASE_URL_ASISTENCIAS = "http://localhost/backend-marcacion/public/api/";

export const sebthi = axios.create({
  baseURL: BASE_URL,
});

export const asistencias = axios.create({
  baseURL: BASE_URL_ASISTENCIAS,
});
