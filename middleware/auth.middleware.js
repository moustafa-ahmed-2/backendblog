

import jwt from "jsonwebtoken";

export const Authentication = (req, res, next) => {
  const token = req.cookies?.token;

  // console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error);

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
