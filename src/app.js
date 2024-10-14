import express from "express";
import multer from "multer";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();

// Middleware para subir archivos
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use("/api/invoices", invoiceRoutes);

export default app;
