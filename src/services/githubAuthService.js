import axios from "axios";
import { config } from "../config/config.js";

const GITHUB_CLIENT_ID = config.githubClientId;
const GITHUB_CLIENT_SECRET = config.githubClientSecret;
const GITHUB_REDIRECT_URI = config.githubRedirectUri;

// Función para obtener la información del usuario de GitHub
export const getGithubUser = async (code) => {
  try {
    // Intercambia el código de autorización por un token de acceso
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.debug(`\nToken de acceso de GitHub: ${accessToken}`);

    if (!accessToken) {
      throw new Error("No access token received from GitHub");
    }

    // Utiliza el token de acceso para obtener la información del usuario
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { login, email, avatar_url, id } = userResponse.data;
    console.debug(`\nInformación del usuario de GitHub: ${JSON.stringify(userResponse.data)}`);

    return {
      userName: login,
      userEmail: email,
      userPicture: avatar_url,
      sub: id.toString(),
    };
  } catch (error) {
    console.log("Error al obtener la información del usuario de GitHub:", error);
    throw new Error("Unauthorized");
  }
};
