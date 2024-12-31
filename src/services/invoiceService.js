import { Op } from "sequelize";
import Invoice from "../models/invoiceModel.js";
import User from "../models/userModel.js";

// * Servicio para guardar los datos extraídos de una factura
export const saveExtractedInvoiceData = async (invoiceData) => {
  try {
    console.debug("Guardando los datos extraídos de la factura:", invoiceData);

    // Verificar que el user_id existe en la tabla Users
    const user = await User.findByPk(invoiceData.user_id);

    if (!user) {
      console.error("Usuario no encontrado. No es posible asignar una factura a un usuario inexistente");
      return { error: "Usuario no encontrado. No es posible asignar una factura a un usuario inexistente" };
    }

    const formatNumber = (value) => {
      const cleanedValue = value.replace(/[€\s]/g, "").replace(/,/g, ".");
      return parseFloat(parseFloat(cleanedValue).toFixed(2));
    };

    const formatPercentage = (value) => {
      const cleanedValue = value.replace(/[^0-9.]/g, "").replace(/,/g, ".");
      return parseFloat(cleanedValue);
    };

    // Formatea la fecha y los valores numéricos
    const formattedInvoiceData = {
      ...invoiceData,
      invoice_date: new Date(invoiceData.invoice_date),
      subtotal: formatNumber(invoiceData.subtotal),
      vat_percentage: formatPercentage(invoiceData.vat_percentage),
      vat_amount: formatNumber(invoiceData.vat_amount),
      total: formatNumber(invoiceData.total),
    };

    console.debug("Datos de la factura formateados:", formattedInvoiceData);

    const savedInvoice = await Invoice.create(formattedInvoiceData);
    return savedInvoice;
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

// Servicio para obtener una factura por ID o número de factura
export const getInvoiceByIdOrNumberFromDB = async (invoiceId, invoiceNumber) => {
  try {
    console.log("Obteniendo la factura con ID y número de factura");
    console.debug("Numero de factura:", invoiceNumber);
    console.debug("ID de la factura:", invoiceId);

    const invoice = await Invoice.findOne({
      where: {
        [Op.or]: [{ id: invoiceId }, { invoice_number: invoiceNumber }],
      },
      include: [{ model: User, as: "user" }],
    });

    return invoice || null;
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
