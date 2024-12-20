// tests/invoiceController.test.js
import { processInvoice } from "../src/controllers/invoiceController.js";
import { extractWithTextract } from "../src/services/textractService.js";
import { extractWithTesseract } from "../src/services/tesseactService.js";

jest.mock("../src/services/textractService.js");
jest.mock("../src/services/tesseactService.js");

describe("processInvoice", () => {
  it("should return extracted data using Textract in production", async () => {
    process.env.ENVIRONMENT = "production";
    const req = { file: { path: "test.pdf" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    extractWithTextract.mockResolvedValue("extracted data");

    await processInvoice(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: "extracted data" });
  });

  it("should return extracted data using Tesseract in development", async () => {
    process.env.ENVIRONMENT = "development";
    const req = { file: { path: "test.pdf" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    extractWithTesseract.mockResolvedValue("extracted data");

    await processInvoice(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: "extracted data" });
  });
});
