import AWS from "aws-sdk";
import fs from "fs";
import { config } from "../config/config.js";
import { parseTextractResult, parseTextractResult_AI } from "../utils/textProcessing.js";

// Verifica que la variable de entorno AWS_REGION esté definida
if (!config.awsRegion) {
  throw new Error("La variable de entorno AWS_REGION no está definida");
}

let AIMode = false;

// Inicializa el cliente de Textract
const textract = new AWS.Textract({ region: config.awsRegion });

// Función para extraer texto de un archivo con Textract
export const extractWithTextract = async (filePath) => {
  try {
    // Verifica que el archivo exista antes de leerlo
    if (!fs.existsSync(filePath)) {
      console.log(`El archivo ${filePath} no existe`);
      throw new Error(`El archivo ${filePath} no existe`);
    }

    // Lee el archivo PDF o imagen
    const fileContent = fs.readFileSync(filePath);

    // Llama a Textract con el contenido del archivo
    const params = {
      Document: {
        Bytes: fileContent,
      },
    };

    const response = await textract.detectDocumentText(params).promise();
    console.log("Datos extraídos con Textract:", response);

    // Procesa la respuesta de Textract
    if (AIMode) {
      const extractedText = await parseTextractResult_AI(response);
      console.log("Texto extraído con Textract y OpenAI:", extractedText);
      return extractedText;
    } else {
      const extractedText = parseTextractResult(response);
      console.log("Texto extraído con Textract:", extractedText);
      return extractedText;
    }
  } catch (error) {
    console.error("Error al extraer datos con Textract:", error);
    throw error;
  }
};
