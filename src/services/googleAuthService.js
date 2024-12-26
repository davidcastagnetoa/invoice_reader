import { OAuth2Client } from "google-auth-library";
import { config } from "../config/config.js";

const client = new OAuth2Client(config.googleClientId, config.googleClientSecret, config.googleRedirectUri);

// Función para obtener la información del usuario de Google
export const getGoogleUser = async (code) => {
  try {
    if (!client) {
      console.log("client not defined");
      throw new Error("client not defined");
    }

    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    console.debug(`\nInformación del usuario de Google: ${JSON.stringify(payload)}`);

    return {
      userName: payload.name,
      userEmail: payload.email,
      userPicture: payload.picture,
      sub: payload.sub,
    };
  } catch (error) {
    console.log("Error al intercambiar el código por tokens: ", error);
    throw new Error("Unauthorized");
  }
};
