import bcrypt from "bcryptjs";
import { getGoogleUser } from "../services/googleAuthService.js";
import {
  createUser,
  findUserByEmail,
  insertOrUpdateGithubUser,
  insertOrUpdateGoogleUser,
} from "../services/userServices.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { getGithubUser } from "../services/githubAuthService.js";

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
  const { name, email, password, cif, client_name, direccion } = req.body;

  try {
    const newUser = await createUser({ name, email, password, cif, client_name, direccion });

    // Genera un token de acceso
    const token = generateAccessToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.message === "El usuario ya existe") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Controlador para iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateAccessToken({ id: user.id, email: user.email });
    res.json({ token });
  } catch (error) {
    console.error("Error al autenticar el usuario:", error);
    res.status(500).json({ error: "Error al autenticar el usuario" });
  }
};

// Controlador para iniciar sesión con Google
export const googleLogin = async (req, res) => {
  const { code } = req.body;

  try {
    const { userName, userEmail, userPicture, sub } = await getGoogleUser(code);

    const userData = await insertOrUpdateGoogleUser(userName, userEmail, userPicture, sub);

    const googlePayload = {
      username: userData.username,
      email: userData.email,
      picture: userData.picture,
    };

    const accessToken = generateAccessToken(googlePayload);
    const refreshToken = generateRefreshToken(googlePayload);

    console.log("\n Token de acceso generado en Login de Google es:", accessToken);
    console.log("\n Token de refresco generado en Login de Google es:", refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
      userInfo: googlePayload,
    });
  } catch (err) {
    console.log("Error en googleLogin:", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

// Controlador para iniciar sesión con GitHub
export const githubLogin = async (req, res) => {
  const { code } = req.body;

  try {
    const { userName, userEmail, userPicture, sub } = await getGithubUser(code);

    const userData = await insertOrUpdateGithubUser(userName, userEmail, userPicture, sub);

    const githubPayload = {
      username: userData.username,
      email: userData.email,
      picture: userData.picture,
    };

    const accessToken = generateAccessToken(githubPayload);
    const refreshToken = generateRefreshToken(githubPayload);

    console.log("\n Token de acceso generado en Login de GitHub es:", accessToken);
    console.log("\n Token de refresco generado en Login de GitHub es:", refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
      userInfo: githubPayload,
    });
  } catch (err) {
    console.log("Error en githubLogin:", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};
