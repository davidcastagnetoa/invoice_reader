import express from "express";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para analizar solicitudes con formato JSON
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de facturas (protegidas)
app.use("/api/invoices", invoiceRoutes);

export default app;
