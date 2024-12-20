import Invoice from "../models/invoiceModel.js";
import User from "../models/userModel.js";

// Función para guardar los datos extraídos de una factura
export const saveExtractedInvoiceData = async (invoiceData) => {
  try {
    const invoice = await Invoice.create(invoiceData);
    return invoice;
  } catch (error) {
    console.error("Error al guardar los datos de la factura:", error);
    throw error;
  }
};

// Otras funciones CRUD existentes
export const createInvoice = async (invoiceData) => {
  try {
    const invoice = await Invoice.create(invoiceData);
    return invoice;
  } catch (error) {
    console.error("Error al crear la factura:", error);
    throw error;
  }
};

export const getInvoicesByUserId = async (userId) => {
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

export const getInvoiceById = async (invoiceId) => {
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

export const updateInvoice = async (invoiceId, updateData) => {
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

export const deleteInvoice = async (invoiceId) => {
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
