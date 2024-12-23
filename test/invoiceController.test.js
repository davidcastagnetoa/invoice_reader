// tests/invoiceController.test.js
import { processInvoice } from "../src/controllers/invoiceController.js";
import { extractWithTextract } from "../src/services/textractService.js";
import { extractWithTesseract } from "../src/services/tesseactService.js";
import { config } from "../src/config/config.js";

jest.mock("../src/services/textractService.js");
jest.mock("../src/services/tesseactService.js");

describe("processInvoice", () => {
  it("should return extracted data using Textract in production", async () => {
    config.environment = "production";
    const req = { file: { path: "test.pdf" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    extractWithTextract.mockResolvedValue("extracted data");

    await processInvoice(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: "extracted data" });
  });

  it("should return extracted data using Tesseract in development", async () => {
    config.environment = "development";
    const req = { file: { path: "test.pdf" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    extractWithTesseract.mockResolvedValue("extracted data");

    await processInvoice(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: "extracted data" });
  });
});
