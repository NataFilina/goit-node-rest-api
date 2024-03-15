import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import {
  createNewUser,
  findUser,
  logUser,
  updateUser,
} from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { helperUpload } from "../helpers/helperUpload.js";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

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
    const verificationToken = crypto.randomUUID();

    await transport.sendMail({
      to: normalizedEmail,
      from: "filinanatash@gmail.com",
      subject: "Welcome to Contacts Book",
      html: `To confirm your registration click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const newUser = {
      password: passwordHash,
      email: normalizedEmail,
      subscription,
      avatarURL: avatar,
      verificationToken,
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

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await findUser({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    updateUser(user._id, { verify: true, verificationToken: null });
    res.send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw HttpError(400, "missing required field email");
    }
    const user = await findUser({ email });
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    await transport.sendMail({
      to: email,
      from: "filinanatash@gmail.com",
      subject: "Welcome to Contacts Book",
      html: `To confirm your registration click on the <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your registration, please open the link http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });
    res.status(200).send({ message: "Verification email sent" });
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

    if (!user.verify) {
      throw HttpError(401, "Not authorized");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await logUser(user._id, { token });

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
    await logUser(req.user._id, { token: null });
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
    const updatedUser = await updateUser(req.user._id, req.body);

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

    const uploadedAvatar = await updateUser(req.user._id, {
      avatarURL: `/avatars/${req.file.filename}`,
    });

    res.status(200).send({
      avatarURL: uploadedAvatar.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
