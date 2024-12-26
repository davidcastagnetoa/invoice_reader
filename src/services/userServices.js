import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/database.js";
import CustomError from "../utils/customError.js";

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
  const { name, email, picture, password, cif, client_name, direccion, isPremium } = userData;

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("email")), email.toLowerCase()),
    });

    if (existingUser) {
      console.debug("Usuario existente. Datos del usuario:", existingUser.dataValues);
      console.error("Error en el servicio. El usuario ya existe");
      throw new CustomError("El usuario ya existe. Por favor, inicie sesión.", "USER_ALREADY_EXISTS");
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = await User.create({
      id: uuidv4(),
      name,
      email,
      picture: picture || "/images/avatar.png",
      password: hashedPassword,
      cif,
      client_name,
      direccion,
      isPremium,
    });

    console.log("Usuario creado correctamente:", newUser);

    return newUser;
  } catch (error) {
    if (error instanceof CustomError && error.code === "USER_ALREADY_EXISTS") {
      throw error; // Re-lanza el error para que el controlador lo maneje
    }
    console.error("Error en el servicio createUser:", error.message);
    throw new CustomError("Error al registrar el usuario", "CREATE_USER_ERROR");
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

// Servicio para buscar un usuario por id. For middleware checkPremium
export const findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.log("Error en findUserById:", error.message);
    throw error;
  }
};
