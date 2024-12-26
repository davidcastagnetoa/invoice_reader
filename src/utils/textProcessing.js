// * Este archivo contiene funciones para procesar los resultados de Textract y Tesseract.
// ! ADVERTENCIA: Archivo crìtico. Evitar modificar sin conocimientos previos y supervisión.

// import { OpenAIApi, Configuration } from "openai";
import { config } from "../config/config.js";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});

const openai = new OpenAIApi(configuration);

const getDataFromOpenAI = async (pText) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Extract the following information from the text and return only the JSON object with the following structure (do not include any additional text, code fences, or formatting):\n\n{\n  "invoice_number": "string",\n  "invoice_date": "string",\n  "issuer_name": "string",\n  "client_cif": "string",\n  "client_name": "string",\n  "issuer_cif": "string",\n  "subtotal": "string",\n  "vat_percentage": "string",\n  "vat_amount": "string",\n  "total": "string"\n}\n\nText: ${pText}`,
        },
      ],
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // console.log("OpenAI raw completion:", completion);
    console.debug("OpenAI raw completion data:", completion.data.choices[0].message.content);

    if (!completion?.data?.choices?.[0]?.message?.content) {
      throw new Error("Respuesta de OpenAI inválida");
    }

    // Parse the JSON completion from the content
    const jsonResponse = JSON.parse(completion.data.choices[0].message.content);
    console.log("OpenAI JSON response:", JSON.stringify(jsonResponse));
    return jsonResponse;
  } catch (error) {
    console.error("Error en getDataFromOpenAI:", error);
    throw new Error(`Error al obtener datos de OpenAI: ${error.message}`);
  }
};

//! Función para procesar los resultados de Textract y extraer la información relevante utilizando OpenAI.
export const parseTextractResult_AI = async (response) => {
  try {
    let extractedLines = [];

    // Itera sobre los bloques de respuesta de Textract
    response.Blocks.forEach((block) => {
      if (block.BlockType === "LINE") {
        // Guarda el texto detectado en el array
        extractedLines.push(block.Text);
      }
    });

    const text = extractedLines.join("\n");
    console.log("TextractResult - Text to process: " + text);

    const completion = await getDataFromOpenAI(text);
    console.debug("OpenAI completion result: " + JSON.stringify(completion));

    if (!completion) {
      throw new Error("Error al procesar la respuesta de OpenAI.");
    }

    try {
      let result;
      if (typeof completion === "string") {
        // Si es una cadena, intenta parsearla como JSON
        result = JSON.parse(completion);
      } else if (typeof completion === "object") {
        // Si ya es un objeto, úsalo directamente
        result = completion;
      } else {
        throw new Error("El formato de la respuesta de OpenAI no es válido.");
      }
      console.debug("Result Parsed from AI: ", result);
      return result;
    } catch (error) {
      console.error("Error al parsear la respuesta de OpenAI:", error.message);
      throw new Error("El formato de la respuesta de OpenAI no es un JSON válido.");
    }
  } catch (error) {
    console.error("Error en parseTextractResult_AI:", error.message);
    throw error;
  }
};

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

// Función para procesar los resultados de Tesseract y extraer la información relevante utilizando OpenAI.
// ! EXPERIMENTAL
// * PREMIUM FUNCTION
export const parseTesseractResult_AI = async (text) => {
  // Llama a OpenAI para analizar el texto
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: `Extract the following information from the text: invoice_number, invoice_date, issuer_name, client_cif, client_name, issuer_cif, subtotal, vat_percentage, vat_amount, total.\n\nText:\n${text}`,
  //   max_tokens: 150,
  // });

  const completion = await completionFunction(text);
  console.log("OpenAI completion result: " + JSON.stringify(completion));

  const result = JSON.parse(completion.data.choices[0].text);
  console.log("Result Parsed: " + JSON.stringify(result));

  return result;
};
