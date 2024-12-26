import { findUserById } from "../services/userServices.js";
import { setPremiumFunction } from "../services/textractService.js";

export const checkPremium = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      console.error("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.isPremium) {
      console.debug("Usuario premium, acceso a funciones premium");
      setPremiumFunction(true);
    } else {
      setPremiumFunction(false);
      console.debug("Usuario no premium, acceso a funciones premium restringido");
      return res.status(403).json({ error: "Acceso denegado. Función premium." });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el estado premium del usuario:", error);
    res.status(500).json({ error: "Error al verificar el estado premium del usuario" });
  }
};
