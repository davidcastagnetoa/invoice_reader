import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.js";
import {
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  processInvoice,
} from "../controllers/invoiceController.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Rutas para obtener, actualizar y eliminar facturas por ID
// Estas rutas deben estar protegidas con autenticación

router.get("/", authenticateToken, getInvoices);
router.get("/:id", authenticateToken, getInvoiceById);
router.put("/:id", authenticateToken, updateInvoice);
router.delete("/:id", authenticateToken, deleteInvoice);

// Ruta para procesar una factura
router.post("/process", authenticateToken, upload.single("file"), processInvoice);

export default router;
