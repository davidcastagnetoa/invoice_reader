import { extractWithTextract } from "../services/textractService.js";
import { extractWithTesseract } from "../services/tesseactService.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const processInvoice = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo." });
  }

  try {
    let extractedData;
    if (process.env.ENVIRONMENT === "production") {
      // Usa AWS Textract para extraer el texto del archivo subido
      extractedData = await extractWithTextract(file.path);
    } else {
      extractedData = await extractWithTesseract(file.path);
    }

    // Eliminar el archivo temporalmente subido
    fs.unlinkSync(file.path);

    return res.json({ data: extractedData });
  } catch (error) {
    return res.status(500).json({ message: "Error procesando la factura", error });
  }
};
