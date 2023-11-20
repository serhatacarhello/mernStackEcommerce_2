import User from "../models/user.js";
import jwt from "jsonwebtoken";

const authenticationMid = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: `Please log in for access` });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);
    req.user = user;
    next(); // Başarılı kimlik doğrulama durumunda next() çağrısı yapılıyor.
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Your session has expired" });
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};

const roleChecked = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have the required access privileges." });
    }
    next();
  };
};

export default { authenticationMid, roleChecked };
