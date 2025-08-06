import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, address, password } = req.body;

  console.log("fullName: ", fullName);

  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = new User({
    fullName,
    email,
    address,
    password,
    role: "Executive",
  });

  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "User registered successfully"));
});

export { registerUser };
