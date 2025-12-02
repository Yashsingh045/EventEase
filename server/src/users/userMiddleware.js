import jwt from "jsonwebtoken";

export const getCurrentUserValidation = (req, res, next) => {
  let token = req.cookies.token;

  // Fallback to Authorization header if cookie is not present
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token.",
      details: error.name,
    });
  }
};

export const updateUserValidation = (req, res, next) => {
  const { email, newRole, newPassword } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!newRole && !newPassword) {
    return res.status(400).json({ message: "New role or password is required" });
  }

  next();
};

export const deleteUserValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  next();
};
