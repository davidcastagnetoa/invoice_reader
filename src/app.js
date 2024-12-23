import express from "express";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de facturas (protegidas)
app.use("/api/invoices", invoiceRoutes);

export default app;
