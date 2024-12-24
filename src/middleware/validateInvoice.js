import { body, validationResult } from "express-validator";

// Middleware de validación. Valida los campos de la factura. Previene que se envíen campos vacíos o con valores incorrectos.
export const validateInvoice = [
  body("user_id").isUUID().withMessage("ID de usuario no válido"),
  body("invoice_number").isString().withMessage("Número de factura no válido"),
  body("invoice_date").isISO8601().withMessage("Fecha de factura no válida"),
  body("issuer_name").isString().withMessage("Nombre del emisor no válido"),
  body("client_cif").isString().withMessage("CIF del cliente no válido"),
  body("client_name").isString().withMessage("Nombre del cliente no válido"),
  body("issuer_cif").isString().withMessage("CIF del emisor no válido"),
  body("subtotal").isDecimal().withMessage("Subtotal no válido"),
  body("vat_percentage").isDecimal().withMessage("Porcentaje de IVA no válido"),
  body("vat_amount").isDecimal().withMessage("Monto de IVA no válido"),
  body("total").isDecimal().withMessage("Total no válido"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    } catch (error) {
      console.error("Error en el middleware de validación:", error);
      res.status(500).json({ error: "Error en el middleware de validación" });
    }
  },
];
