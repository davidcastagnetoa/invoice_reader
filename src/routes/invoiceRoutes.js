import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.js";
import { checkPremium } from "../middleware/checkPremium.js";
import {
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  processInvoice,
} from "../controllers/invoiceController.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

//! Estas rutas deben estar protegidas con autenticación
// Rutas para obtener todas las facturas de un usuario.
router.get("/", authenticateToken, getInvoices);

// Ruta para obtener una factura por ID
router.get("/:id", authenticateToken, getInvoiceById);

// Rutas para actualizar una factura por ID
router.put("/:id", authenticateToken, updateInvoice);

// Rutas para eliminar una factura por ID
router.delete("/:id", authenticateToken, deleteInvoice);

// Ruta para procesar una factura
router.post("/process", authenticateToken, checkPremium, upload.single("file"), processInvoice);

export default router;
