import User from "../models/user.js";
import jwt from "jsonwebtoken";

const authenticationMid = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("🚀 ~ file: auth.js:7 ~ authenticationMid ~ token:", token);

    if (!token) {
      return res.status(401).json({ message: `Erişim için giriş yapınız` });
    }

    const decodedData = jwt.verify(token, "JWT_SECRET");
    console.log(
      "🚀 ~ file: auth.js:14 ~ authenticationMid ~ decodedData:",
      decodedData
    );
    const user = await User.findById(decodedData.id);
    console.log("🚀 ~ file: auth.js:19 ~ authenticationMid ~ user:", user);
    req.user = user;
    next(); // Başarılı kimlik doğrulama durumunda next() çağrısı yapılıyor.
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Oturumunuzun süresi doldu" });
    } else {
      return res.status(403).json({ message: "Geçersiz token" });
    }
  }
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
