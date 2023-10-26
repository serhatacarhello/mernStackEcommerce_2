import User from "../models/user.js";
import jwt from "jsonwebtoken";

const authenticationMid = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(500).json({ message: "Erişim için giriş yapınız" });
  const decodedData = jwt.verify(token, "JWT_SECRET");
  if (!decodedData)
    return res.status(500).json({ message: "Erişim tokenınız geçersizdir." });

  req.user = await User.findById(decodedData.id);

  next();
};

const roleChecked = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Erişim yetkiniz bulunmamaktadır." });
    }
    next();
  };
};



export default { authenticationMid, roleChecked };
