// * Este archivo contiene funciones para procesar los resultados de Textract y Tesseract.
// ! ADVERTENCIA: Archivo crìtico. Evitar modificar sin conocimientos previos y supervisión.

// import { OpenAIApi, Configuration } from "openai";
import { config } from "../config/config.js";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});

const openai = new OpenAIApi(configuration);

const getDataFromOpenAI = async (pText, pUserName) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Extract the following information from the text and return only the JSON object with the following structure (do not include any additional text, code fences, or formatting):\n\n{\n  "invoice_number": "string",\n  "invoice_date": "string",\n  "issuer_name": "string",\n  "client_cif": "string",\n  "client_name": "string",\n  "issuer_cif": "string",\n  "subtotal": "string",\n  "vat_percentage": "string",\n  "vat_amount": "string",\n  "total": "string"\n}\nEnsure that the values for subtotal, vat_percentage, vat_amount, and total are always formatted correctly as floats separated by a comma, and for vat_percentage only include the numeric value as a float without the "%" symbol, even if the original text contains whole numbers (e.g., "subtotal: '3 €'" should be returned as "subtotal: '3,00 €'")\n\nIf the company name ${pUserName} is found in the text, along with indications that ${pUserName} is the recipient of the invoice, treat the data of ${pUserName} as the client's details (both client_name and client_cif). Otherwise, assign the appropriate values to the issuer fields based on the invoice's context.\n\nText: ${pText}`,
        },
      ],
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // console.log("OpenAI raw completion:", completion);
    console.debug("..:: OpenAI raw completion data:", completion.data.choices[0].message.content);

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

// * Funciones AWS Textract
// * PREMIUM FUNCTION - Open AI
export const parseTextractResult_AI = async (response, pUserName) => {
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

    const completion = await getDataFromOpenAI(text, pUserName);
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

// ! No PREMIUM FUNCTION - No Open AI
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

// - Funciones Tesseact - En desarrollo
export const parseTesseractResult = (text, pUserName) => {
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

// - Funciones Tesseact and OPEN AI - En desarrollo
export const parseTesseractResult_AI = async (pText, pUserName) => {
  const completion = await completionFunction(pText);
  console.log("OpenAI completion result: " + JSON.stringify(completion));

  const result = JSON.parse(completion.data.choices[0].pText);
  console.log("Result Parsed: " + JSON.stringify(result));

  return result;
};
