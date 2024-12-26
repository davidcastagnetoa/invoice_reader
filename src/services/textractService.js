import { config } from "../config/config.js";
import { parseTextractResult, parseTextractResult_AI } from "../utils/textProcessing.js";
import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";

// Set the AWS Region.
const REGION = config.awsRegion;

// Verifica que la variable de entorno AWS_REGION esté definida
if (!REGION) {
  throw new Error("La variable de entorno AWS_REGION no está definida");
}

// Create SNS service object.
const textractClient = new TextractClient({
  region: REGION,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

let PremiumFunction = false;

// Función para activar o desactivar la función premium
export const setPremiumFunction = (mode) => {
  PremiumFunction = mode;
};

export const extractWithTextract = async (bucketName, documentName) => {
  try {
    // Set params
    const params = {
      Document: {
        S3Object: {
          Bucket: bucketName,
          Name: documentName,
        },
      },
      FeatureTypes: ["TABLES", "FORMS", "LAYOUT"], // "TABLES" || "FORMS" || "QUERIES" || "SIGNATURES" || "LAYOUT",
    };

    // const response = await textract.detectDocumentText(params).promise();
    const analyzeDoc = new AnalyzeDocumentCommand(params);
    console.log("\nExtrayendo datos con Textract...", analyzeDoc);

    // Get the text from the document
    const response = await textractClient.send(analyzeDoc);
    console.log("Datos extraídos con Textract:", response);

    if (PremiumFunction) {
      const extractedText = await parseTextractResult_AI(response);
      console.log("Texto extraído con Textract y OpenAI:", extractedText);
      return extractedText;
    } else {
      const extractedText = parseTextractResult(response);
      console.log("Texto extraído con Textract:", extractedText);
      return extractedText;
    }
  } catch (error) {
    console.error("\nError al extraer datos con Textract:", error);
    throw error;
  }
};
