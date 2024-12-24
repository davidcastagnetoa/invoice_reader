import { findUserById } from "../services/userServices.js";
import { setPremiumFunction } from "../services/textractService.js";

export const checkPremium = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.isPremium) {
      setPremiumFunction(true);
    } else {
      setPremiumFunction(false);
      return res.status(403).json({ error: "Acceso denegado. Función premium." });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el estado premium del usuario:", error);
    res.status(500).json({ error: "Error al verificar el estado premium del usuario" });
  }
};
