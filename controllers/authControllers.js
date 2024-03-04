import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createNewUser,
  findUser,
  loginUser,
  logoutUser,
  updateSubscription,
} from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  const { password, subscription, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await findUser({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      password: passwordHash,
      email: normalizedEmail,
      subscription,
    };

    await createNewUser(newUser);
    const createdNewUser = await findUser({ email: normalizedEmail });

    res.status(201).send({
      user: {
        email: normalizedEmail,
        subscription: createdNewUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { password, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await findUser({ email: normalizedEmail });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await loginUser(user._id, { token });

    res.status(200).send({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  const email = req.user.email;
  try {
    const user = await findUser({ email });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).send({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserSubscription = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw HttpError(401, "Not authorized");
    }
    const token = authHeader.split(" ")[1];
    const user = await findUser({ token });
    const updatedUser = await updateSubscription(user._id, req.body);
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};
