import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: ["Admin", "Manager", "Supervisor", "Executive"],
        message: "{VALUE} is not a valid role",
      },
      required: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//------
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.pre("save", async function (next) {
  // password hash
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  //please accept this code anik vai--
  if (!this.userName && this.fullName) {
    // Generate a random alphanumeric string (6 chars)
    const randomString = Math.random().toString(36).slice(2, 6); // e.g.: "59e872"

    // clean and lowercase the full name 
    const cleanFullName = this.fullName.toLowerCase().replace(/\s+/g, "");
    this.userName = `@${cleanFullName}BhaloJob${randomString}`;
  }



  // if (!this.userName && this.fullName) {
  //   const uid = this._id
  //     ? this._id.toString().slice(-6)
  //     : new mongoose.Types.ObjectId().toString().slice(-6);
  //   const cleanFullName = this.fullName.toLowerCase().replace(/\s+/g, "");
  //   this.userName = `@${cleanFullName}${uid}`;
  // }

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
