import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto"; // it is already in node.js
import nodemailer from "nodemailer";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isExists = await User.findOne({ email });
  if (isExists) {
    return res
      .status(500)
      .json({ message: "Bu email adresi ile bir kullanıcı zaten kayıtlı." });
  }
  if (password.length < 6) {
    return res
      .status(500)
      .json({ message: "Şifre 6 karakterden küçük olamaz." });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return res
      .status(500)
      .json({ message: "Geçerli bir email adresi sağlamalısınız." });
  }

  function isValidEmail(email) {
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const emailRegex =
      /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;
    return emailRegex.test(email);
  }

  try {
    //upload avatar image
    const avatar = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 130,
      crop: "scale",
    });
    console.log("🚀 ~ file: user.js:12 ~ register ~ avatar:", avatar);

    const hashed_password = await bcrypt.hash(password, 10);

    const new_user = await User.create({
      name,
      email,
      password: hashed_password,
      avatar: {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      },
    });

    const token = jwt.sign({ id: new_user._id }, "JWT_SECRET", {
      expiresIn: "1d",
    });
    // save token to cookies
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const userData = new_user.toObject();

    delete userData.password;
    delete userData.__v;

    res.status(201).cookie("token", token, cookieOptions).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Register process doesn't work" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(500).json({ message: "Böyle bir kullanıcı bulunamadı." });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(500).json({ message: "Hatalı parola girdiniz." });
  }

  const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });

  const cookieOptions = {
    httpOnly: "true",
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  const userData = user.toObject();

  delete userData.password;
  delete userData.__v;

  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ user: userData, token });
};

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: "true",
    expires: new Date(Date.now()),
  };

  res
    .status(200)
    .cookie("token", null, cookieOptions)
    .json({ message: "Çıkış işlemi başarılı" });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "Böyle bir kullanıcı bulunamadı." });
  }

  // Burada şifre sıfırlama işlemini gerçekleştirin
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  //  şifre sıfırlama bağlantısı oluşturun ve kullanıcıya gönderin

  const passwordResetLink = `${req.protocol}://${req.get(
    "host"
  )}/reset/${resetToken}`;
  const emailHTML = `
    <p>Please click on the following link to reset your password :</p>
    <a href="${passwordResetLink}">${passwordResetLink}</a>
  `;
  try {
    // use mailtrap

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_EMAIL, //your email address
        pass: process.env.NODEMAILER_PW, // your email password
      },
    });

    // without mailtrap

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.NODEMAILER_EMAIL, //your email address
    //     pass: process.env.NODEMAILER_PW, // your email password
    //   },
    // });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL, //sender email address
      to: req.body.email, // list of receivers
      subject: "Reset Password",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mailinizi kontrol ediniz." });
  } catch (error) {
    // Eğer bir hata oluşursa hatayı yakalayın ve uygun bir yanıt döndürün.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(500).json({
      message:
        "Böyle bir kullanıcı bulunamadı. Lütfen kayıtlı bir e-posta adresi kullanarak yeniden deneyin.",
    });
  }
  // eger kullanıcı varsa şifresine gelen şifreyi atama yapıyoruz
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };
  const userData = user.toObject();

  delete userData.password;
  delete userData.__v;
  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ user: userData, token });
};

const userDetail = async (req, res, next) => {
  console.log("🚀 ~ file: user.js:233 ~ userDetail ~ rwq.user:", req.user.id);
  try {
    const user = await User.findById(req.user.id);
    console.log("userdetailcalistı", user);

    const userData = user.toObject();

    delete userData.password;
    delete userData.__v;

    res.status(200).json({ user: userData });
    next();
  } catch (error) {
    console.log(error);
  }
};

export { register, login, logout, forgotPassword, resetPassword, userDetail };
