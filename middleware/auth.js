import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "3d" });
};

export const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = decoded; 

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ status: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ status: false, message: "Not authorized, no token" });
  }
};