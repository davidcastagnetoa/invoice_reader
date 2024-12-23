import Invoice from "../models/invoiceModel.js";
import User from "../models/userModel.js";

// Servicio para guardar los datos extraídos de una factura
export const saveExtractedInvoiceData = async (invoiceData) => {
  try {
    const invoice = await Invoice.create(invoiceData);
    return invoice;
  } catch (error) {
    console.error("Error al guardar los datos de la factura:", error);
    throw error;
  }
};

// Servicio para crear una factura en la base de datos
export const createInvoice = async (invoiceData) => {
  try {
    const invoice = await Invoice.create(invoiceData);
    return invoice;
  } catch (error) {
    console.error("Error al crear la factura:", error);
    throw error;
  }
};

// Servicio para obtener las facturas de un usuario
export const getInvoicesFromDB = async (userId) => {
  try {
    const invoices = await Invoice.findAll({
      where: { user_id: userId },
      include: [{ model: User, as: "user" }],
    });
    return invoices;
  } catch (error) {
    console.error("Error al obtener las facturas del usuario:", error);
    throw error;
  }
};

// Servicio para obtener una factura por ID
export const getInvoiceByIdFromDB = async (invoiceId) => {
  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: User, as: "user" }],
    });
    if (!invoice) {
      throw new Error("Factura no encontrada");
    }
    return invoice;
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    throw error;
  }
};

// Servicio para actualizar una factura en la base de datos
export const updateInvoiceInDB = async (invoiceId, updateData) => {
  try {
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      throw new Error("Factura no encontrada");
    }
    await invoice.update(updateData);
    return invoice;
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    throw error;
  }
};

// Servicio para eliminar una factura de la base de datos
export const deleteInvoiceFromDB = async (invoiceId) => {
  try {
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      throw new Error("Factura no encontrada");
    }
    await invoice.destroy();
    return { message: "Factura eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    throw error;
  }
};
