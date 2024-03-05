import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export async function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw HttpError(401, "Not authorized");
    }
    // const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
      if (error) {
        throw HttpError(401, "Not authorized");
      }
      try {
        const user = await User.findById(decode.id);

        if (!user || token !== user.token) {
          throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}
