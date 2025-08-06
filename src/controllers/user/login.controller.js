
import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Controller
const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
  });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User not found"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials"));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);


  const userData = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userData, accessToken, refreshToken }, "Login successful"));
});




const logoutUser = asyncHandler(async (req, res) => {
  // Clear both tokens
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully logged out"));
});


export { loginUser, logoutUser };
