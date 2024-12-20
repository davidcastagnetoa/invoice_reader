// * Este archivo contiene funciones para procesar los resultados de Textract y Tesseract.
// ! ADVERTENCIA: Archivo crìtico. Evitar modificar sin conocimientos previos y supervisión.

import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Función para procesar los resultados de Textract y extraer la información relevante.
export const parseTextractResult = (response) => {
  let extractedLines = [];

  // Itera sobre los bloques de respuesta de Textract
  response.Blocks.forEach((block) => {
    if (block.BlockType === "LINE") {
      // Guarda el texto detectado en el array
      extractedLines.push(block.Text);
    }
  });

  // Aquí puedes agregar lógica adicional para extraer información específica si es necesario
  const invoiceData = {
    invoice_number: extractedLines[0], // Ejemplo de cómo podrías mapear los datos
    invoice_date: extractedLines[1],
    issuer_name: extractedLines[2],
    client_cif: extractedLines[3],
    client_name: extractedLines[4],
    issuer_cif: extractedLines[5],
    subtotal: parseFloat(extractedLines[6]),
    vat_percentage: parseFloat(extractedLines[7]),
    vat_amount: parseFloat(extractedLines[8]),
    total: parseFloat(extractedLines[9]),
  };

  return invoiceData;
};

// Función para procesar los resultados de Tesseract y extraer la información relevante.
export const parseTesseractResult = (text) => {
  // En este caso, simplemente se divide el texto en líneas.
  const extractedLines = text.split("\n");

  // Aquí puedes agregar lógica adicional para extraer información específica si es necesario
  const invoiceData = {
    invoice_number: extractedLines[0], // Ejemplo de cómo podrías mapear los datos
    invoice_date: extractedLines[1],
    issuer_name: extractedLines[2],
    client_cif: extractedLines[3],
    client_name: extractedLines[4],
    issuer_cif: extractedLines[5],
    subtotal: parseFloat(extractedLines[6]),
    vat_percentage: parseFloat(extractedLines[7]),
    vat_amount: parseFloat(extractedLines[8]),
    total: parseFloat(extractedLines[9]),
  };

  return invoiceData;
};

// Función para procesar los resultados de Textract y extraer la información relevante utilizando OpenAI. //! EXPERIMENTAL
export const parseTextractResult_AI = async (response) => {
  let extractedLines = [];

  // Itera sobre los bloques de respuesta de Textract
  response.Blocks.forEach((block) => {
    if (block.BlockType === "LINE") {
      // Guarda el texto detectado en el array
      extractedLines.push(block.Text);
    }
  });

  const text = extractedLines.join("\n");

  // Llama a OpenAI para analizar el texto
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Extract the following information from the text: invoice_number, invoice_date, issuer_name, client_cif, client_name, issuer_cif, subtotal, vat_percentage, vat_amount, total.\n\nText:\n${text}`,
    max_tokens: 150,
  });

  const result = JSON.parse(completion.data.choices[0].text);

  return result;
};

// Función para procesar los resultados de Tesseract y extraer la información relevante utilizando OpenAI. //! EXPERIMENTAL
export const parseTesseractResult_AI = async (text) => {
  // Llama a OpenAI para analizar el texto
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Extract the following information from the text: invoice_number, invoice_date, issuer_name, client_cif, client_name, issuer_cif, subtotal, vat_percentage, vat_amount, total.\n\nText:\n${text}`,
    max_tokens: 150,
  });

  const result = JSON.parse(completion.data.choices[0].text);

  return result;
};
