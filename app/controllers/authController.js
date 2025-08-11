const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendEmailVerificationOTP = require("../helper/sendOtpVerify");
const otpModel = require("../models/otpModel");
const { comparePassword } = require("../middleware/auth");

// @desc    User Signup with Email Verification
exports.signup = async (req, res) => {
  try {
    const { name, email, password, bio} = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio,
      verificationToken,
    });
    const data = await user.save();
    sendEmailVerificationOTP(req, user);
    

    res.status(201).json({
      status:true,
      message:
        "Signup successful! Please check your email to verify your account.",
        data:data
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Check if all required fields are provided
    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }
    const Userexisting = await User.findOne({ email });

    // Check if email doesn't exists
    if (!Userexisting) {
      return res
        .status(404)
        .json({ status: "failed", message: "Email doesn't exists" });
    }

    // Check if email is already verified
    if (Userexisting.isVerified==true) {
      return res
        .status(400)
        .json({ status: false, message: "Email is already verified" });
    }
    // Check if there is a matching email verification OTP
    const emailVerification = await otpModel.findOne({
      userId: Userexisting._id,
      otp,
    });
    if (!emailVerification) {
      if (!Userexisting.isVerified) {
        // console.log(existingUser);
        await sendEmailVerificationOTP(req, Userexisting);
        return res.status(400).json({
          status: false,
          message: "Invalid OTP, new OTP sent to your email",
        });
      }
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }
    // Check if OTP is expired
    const currentTime = new Date();
    // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
    const expirationTime = new Date(
      emailVerification.createdAt.getTime() + 15 * 60 * 1000
    );
    if (currentTime > expirationTime) {
      // OTP expired, send new OTP
      await sendEmailVerificationOTP(req, existingUser);
      return res.status(400).json({
        status: "failed",
        message: "OTP expired, new OTP sent to your email",
      });
    }
    // OTP is valid and not expired, mark email as verified
    Userexisting.isVerified = true;
    await Userexisting.save();

    // Delete email verification document
    await otpModel.deleteMany({ userId: Userexisting._id });
    return res
      .status(200)
      .json({ status: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Unable to verify email, please try again later",
    });
  }
};

// @desc    User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "All filed is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user not found",
      });
    }
    // Check if user verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ status: false, message: "Your account is not verified" });
    }
    const ismatch = comparePassword(password, user.password);
    if (!ismatch) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRECT_KEY,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      status: true,
      message: "user login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
