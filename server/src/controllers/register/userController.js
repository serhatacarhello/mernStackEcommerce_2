// userController.js

// import UserService from "./userService";

// const userService = new UserService();

// export const register = async (req, res) => {
//   try {
//     const { user, token } = await userService.register(req.body);
//      // save token to cookies
//      const cookieOptions = {
//       httpOnly: true,
//       expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//     };

//     const userData = new_user.toObject();

//     delete userData.password;
//     delete userData.__v;

//     // Send response
//     res.status(201).cookie("token", token,cookieOptions).json({
//       user,
//       token,
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       message: error.message,
//     });
//   }
// };