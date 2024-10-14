import Tesseract from "tesseract.js";

export const extractWithTesseract = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng");
  return parseTesseractResult(result.data);
};

const parseTesseractResult = (data) => {
  // Lógica para procesar los resultados de Tesseract y extraer la información relevante
};
