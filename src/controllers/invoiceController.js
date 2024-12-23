import fs from "fs";
import { extractWithTextract } from "../services/textractService.js";
import { extractWithTesseract } from "../services/tesseactService.js";
import { saveExtractedInvoiceData } from "../services/invoiceService.js";
import {
  getInvoicesFromDB,
  getInvoiceByIdFromDB,
  updateInvoiceInDB,
  deleteInvoiceFromDB,
} from "../services/invoiceService.js";
import { config } from "../config/config.js";

// Controlador para procesar una factura
export const processInvoice = async (req, res) => {
  try {
    const filePath = req.file.path;
    let extractedData;

    if (config.environment === "production") {
      console.log("Modo Produccion: Extrayendo datos con Amazon Textract...");
      extractedData = await extractWithTextract(filePath);
    } else {
      console.log("Modo Desarrollador: Extrayendo datos con Tesseract OCR...");
      extractedData = await extractWithTesseract(filePath);
    }

    // Aquí puedes mapear los datos extraídos a los campos del modelo Invoice
    const invoiceData = {
      user_id: req.body.user_id, // Asegúrate de que el user_id esté en el cuerpo de la solicitud
      invoice_number: extractedData.invoice_number,
      invoice_date: extractedData.invoice_date,
      issuer_name: extractedData.issuer_name,
      client_cif: extractedData.client_cif,
      client_name: extractedData.client_name,
      issuer_cif: extractedData.issuer_cif,
      subtotal: extractedData.subtotal,
      vat_percentage: extractedData.vat_percentage,
      vat_amount: extractedData.vat_amount,
      total: extractedData.total,
    };

    const savedInvoice = await saveExtractedInvoiceData(invoiceData);
    console.log("Factura procesada correctamente:", savedInvoice);

    // Elimina el archivo temporalmente subido
    fs.unlinkSync(filePath);

    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error("Error al procesar la factura:", error);

    // Elimina el archivo temporalmente subido en caso de error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Error al procesar la factura" });
  }
};

// Controlador para obtener todas las facturas de un usuario.
export const getInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await getInvoicesFromDB(userId);
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    res.status(500).json({ error: "Error al obtener las facturas" });
  }
};

// Controlador para obtener una factura por ID.
export const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await getInvoiceByIdFromDB(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    res.status(500).json({ error: "Error al obtener la factura" });
  }
};

// Controlador para actualizar una factura por ID.
export const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updatedData = req.body;
    const updatedInvoice = await updateInvoiceInDB(invoiceId, updatedData);
    if (!updatedInvoice) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    res.status(500).json({ error: "Error al actualizar la factura" });
  }
};

// Controlador para eliminar una factura por ID.
export const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const deletedInvoice = await deleteInvoiceFromDB(invoiceId);
    if (!deletedInvoice) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    res.status(500).json({ error: "Error al eliminar la factura" });
  }
};
