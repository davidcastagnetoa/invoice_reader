import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

// Servicio para insertar o actualizar un usuario de Google. For GoogleAuth Controller
export const insertOrUpdateGoogleUser = async (userName, userEmail, userPicture, sub) => {
  try {
    let user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      user = await User.create({
        id: sub,
        name: userName,
        email: userEmail,
        picture: userPicture,
      });
      console.log("Usuario creado:", user);
    } else {
      // Actualiza los datos del usuario si ya existe
      user.name = userName;
      user.picture = userPicture;
      await user.save();
      console.log("Usuario actualizado:", user);
    }

    return user;
  } catch (error) {
    console.log("Error en insertOrUpdateGoogleUser:", error.message);
    throw error;
  }
};

// Servicio para insertar o actualizar un usuario de GitHub. For GithubAuth Controller
export const insertOrUpdateGithubUser = async (userName, userEmail, userPicture, sub) => {
  try {
    let user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      user = await User.create({
        id: sub,
        name: userName,
        email: userEmail,
        picture: userPicture,
      });
      console.log("Usuario creado:", user);
    } else {
      // Actualiza los datos del usuario si ya existe
      user.name = userName;
      await user.save();
      console.log("Usuario actualizado:", user);
    }

    return user;
  } catch (error) {
    console.log("Error en insertOrUpdateGithubUser:", error.message);
    throw error;
  }
};

// Servicio para crear un usuario. For Register Controller
export const createUser = async (userData) => {
  const { name, email, password, cif, client_name, direccion } = userData;

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = await User.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      cif,
      client_name,
      direccion,
    });

    return newUser;
  } catch (error) {
    console.log("Error en createUser:", error.message);
    throw error;
  }
};

// Servicio para buscar un usuario por email .For Login Controller
export const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.log("Error en findUserByEmail:", error.message);
    throw error;
  }
};
