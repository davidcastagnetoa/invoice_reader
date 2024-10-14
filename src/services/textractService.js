import AWS from "aws-sdk";
import fs from "fs";

// Inicializa el cliente de Textract
const textract = new AWS.Textract({ region: process.env.AWS_REGION });

export const extractWithTextract = async (filePath) => {
  try {
    // Lee el archivo PDF o imagen
    const fileContent = fs.readFileSync(filePath);

    // Llama a Textract con el contenido del archivo
    const params = {
      Document: {
        Bytes: fileContent,
      },
    };

    const response = await textract.detectDocumentText(params).promise();

    // Procesa la respuesta de Textract
    const extractedText = parseTextractResult(response);

    return extractedText;
  } catch (error) {
    console.error("Error al extraer datos con Textract:", error);
    throw error;
  }
};

// Función para procesar los datos obtenidos de Textract
const parseTextractResult = (response) => {
  let extractedLines = [];

  // Itera sobre los bloques de respuesta de Textract
  response.Blocks.forEach((block) => {
    if (block.BlockType === "LINE") {
      // Guarda el texto detectado en el array
      extractedLines.push(block.Text);
    }
  });

  return extractedLines;
};
