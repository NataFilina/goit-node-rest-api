import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  createNewUser,
  findUser,
  loginUser,
  logoutUser,
  updateSubscription,
  uploadUserAvatar,
} from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { helperUpload } from "../helpers/helperUpload.js";

export const register = async (req, res, next) => {
  const { password, subscription, email } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await findUser({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mp",
    });

    const newUser = {
      password: passwordHash,
      email: normalizedEmail,
      subscription,
      avatarURL: avatar,
    };

    const createdNewUser = await createNewUser(newUser);

    res.status(201).send({
      user: {
        email: normalizedEmail,
        subscription: createdNewUser.subscription,
        avatarURL: createdNewUser.avatarURL,
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
    const updatedUser = await updateSubscription(req.user._id, req.body);
    res.status(200).send({
      token: updatedUser.token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    await helperUpload(req.file.path);

    await fs.rename(
      req.file.path,
      path.join(process.cwd(), "public/avatars", req.file.filename)
    );

    const uploadedAvatar = await uploadUserAvatar(req.user._id, {
      avatarURL: `${/avatars/}${req.file.filename}`,
    });

    res.status(200).send({
      avatarURL: uploadedAvatar.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
