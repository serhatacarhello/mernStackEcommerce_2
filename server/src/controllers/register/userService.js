// userService.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateInput } from "./validations";
import { v2 as cloudinary } from "cloudinary";
import User from "../../models/user";

class UserService {
  async register(input) {
    try {
      // Validate
      validateInput(input.name, input.email, input.password);

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Upload avatar
      const avatar = await uploadAvatar(input.avatar);

      // Create user
      const user = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        avatar: avatar,
      });

      // Create token
      const token = createToken(user);

      // Return
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(avatar) {
    const result = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }
}

function createToken(user) {
  return jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });
}

export default UserService