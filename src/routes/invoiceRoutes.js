import { Router } from "express";
import { processInvoice } from "../controllers/invoiceController.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("file"), processInvoice);

export default router;
