import Tesseract from "tesseract.js";
import fs from "fs";
import { parseTesseractResult, parseTextractResult_AI } from "../utils/textProcessing.js";

let PremiumFunction = false;

// Función para activar o desactivar la función premium
export const setPremiumFunction = (mode) => {
  PremiumFunction = mode;
};

// Función para extraer texto de una imagen con Tesseract.
export const extractWithTesseract = async (filePath) => {
  try {
    // Verifica que el archivo exista antes de leerlo
    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo ${filePath} no existe`);
    }

    // Lee el archivo PDF o imagen
    const fileContent = fs.readFileSync(filePath);

    // Llama a Tesseract con el contenido del archivo
    const {
      data: { text },
    } = await Tesseract.recognize(fileContent, "eng");
    console.log("Texto extraído con Tesseract:", text);

    // Procesa la respuesta de Tesseract
    if (PremiumFunction) {
      const extractedText = await parseTextractResult_AI(text);
      console.log("Datos extraídos con Tesseract y OpenAI:", extractedText);
      return extractedText;
    } else {
      const extractedText = parseTesseractResult(text);
      console.log("Datos extraídos con Tesseract:", extractedText);
      return extractedText;
    }
  } catch (error) {
    console.error("Error al extraer datos con Tesseract:", error);
    throw error;
  }
};
