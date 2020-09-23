import jwt from "jsonwebtoken";
import config from "config";
import { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["moon-auth"];

  // const token = req.cookies.auth;

  if (!token) {
    return res.status(401).json({
      msg: "Not authorized",
      param: "auth",
    });
  }

  try {
    let auth = jwt.verify(token.toString(), config.get("jwtSecret"));
    // @ts-ignore
    req.user = auth.user;
    next();
  } catch (error) {
    res.cookie("auth", "", { maxAge: 1 });
    res.status(401).json({
      msg: "Invalid token",
      param: "auth",
    });
  }
};

export { auth };
