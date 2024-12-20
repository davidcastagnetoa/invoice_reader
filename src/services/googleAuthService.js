import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

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
      audience: process.env.GOOGLE_CLIENT_ID,
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
