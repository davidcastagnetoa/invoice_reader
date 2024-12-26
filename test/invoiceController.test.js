import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js"; // Asegúrate de que la ruta a tu archivo app.js sea correcta
import { extractWithTextract } from "../src/services/textractService.js";
import { extractWithTesseract } from "../src/services/tesseactService.js";
import { saveExtractedInvoiceData } from "../src/services/invoiceService.js";
import fs from "fs";
import { config } from "../src/config/config.js";

// Create mock functions
const mockExtractWithTextract = jest.fn();
const mockExtractWithTesseract = jest.fn();
const mockSaveExtractedInvoiceData = jest.fn();
const mockUnlinkSync = jest.fn();

// Mock modules
jest.unstable_mockModule("../src/services/textractService.js", () => ({
  extractWithTextract: mockExtractWithTextract,
}));

jest.unstable_mockModule("../src/services/tesseactService.js", () => ({
  extractWithTesseract: mockExtractWithTesseract,
}));

jest.unstable_mockModule("../src/services/invoiceService.js", () => ({
  saveExtractedInvoiceData: mockSaveExtractedInvoiceData,
}));

jest.unstable_mockModule("fs", () => ({
  unlinkSync: mockUnlinkSync,
}));

describe("Invoice Controller", () => {
  describe("POST /process", () => {
    it("should process an invoice using Textract in production mode", async () => {
      // Mock de la configuración
      config.environment = "production";

      // Mock de la función extractWithTextract
      mockExtractWithTextract.mockResolvedValue({
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      // Mock de la función saveExtractedInvoiceData
      mockSaveExtractedInvoiceData.mockResolvedValue({
        id: "1",
        user_id: "user123",
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      // Mock de fs.unlinkSync
      fs.unlinkSync.mockImplementation(() => {});

      const response = await request(app)
        .post("/api/invoices/process")
        .attach("file", "path/to/test/file.pdf")
        .field("user_id", "user123");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: "1",
        user_id: "user123",
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      expect(extractWithTextract).toHaveBeenCalledWith(expect.any(String));
      expect(saveExtractedInvoiceData).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          invoice_number: "12345",
          invoice_date: "2023-01-01",
          issuer_name: "Issuer Name",
          client_cif: "Client CIF",
          client_name: "Client Name",
          issuer_cif: "Issuer CIF",
          subtotal: 100,
          vat_percentage: 21,
          vat_amount: 21,
          total: 121,
        })
      );
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should process an invoice using Tesseract in development mode", async () => {
      // Mock de la configuración
      config.environment = "production";

      // Mock de la función extractWithTesseract
      mockExtractWithTesseract.mockResolvedValue({
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      // Mock de la función saveExtractedInvoiceData
      mockSaveExtractedInvoiceData.mockResolvedValue({
        id: "1",
        user_id: "user123",
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      // Mock de fs.unlinkSync
      fs.unlinkSync.mockImplementation(() => {});

      const response = await request(app)
        .post("/api/invoices/process")
        .attach("file", "path/to/test/file.pdf")
        .field("user_id", "user123");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: "1",
        user_id: "user123",
        invoice_number: "12345",
        invoice_date: "2023-01-01",
        issuer_name: "Issuer Name",
        client_cif: "Client CIF",
        client_name: "Client Name",
        issuer_cif: "Issuer CIF",
        subtotal: 100,
        vat_percentage: 21,
        vat_amount: 21,
        total: 121,
      });

      expect(extractWithTesseract).toHaveBeenCalledWith(expect.any(String));
      expect(saveExtractedInvoiceData).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          invoice_number: "12345",
          invoice_date: "2023-01-01",
          issuer_name: "Issuer Name",
          client_cif: "Client CIF",
          client_name: "Client Name",
          issuer_cif: "Issuer CIF",
          subtotal: 100,
          vat_percentage: 21,
          vat_amount: 21,
          total: 121,
        })
      );
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });
});
