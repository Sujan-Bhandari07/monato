import User from "../models/usermodel.js";
import validator from "validator";
import { err, success } from "../utils/response.js";
import { tryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcryptjs";
import { gettoken } from "../utils/jwt.js";
import transporter from "../config/nodemailer.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
const signup = tryCatch(async (req, res) => {
    const { fullName, email, password, role } = req.body;
    const files = req.files;
    const profilepic = files.profilepic?.[0];
    console.log(profilepic);
    if (!fullName || !email || !password || !role || !profilepic) {
        return err(res, "pls provide all credentials");
    }
    let user = await User.findOne({ email });
    if (user) {
        return err(res, "User already exist");
    }
    if (!validator.isEmail(email)) {
        return err(res, "Pls enter valid email");
    }
    if (!validator.isStrongPassword(password)) {
        return err(res, "Pls eneter strong password");
    }
    const hashed = await bcrypt.hash(password, 10);
    const pp = await cloudinary.uploader.upload(profilepic.path, {
        resource_type: "image"
    });
    if (!pp) {
        return err(res, "Pls try again");
    }
    console.log(pp.secure_url);
    user = await User.create({
        email,
        password: hashed,
        fullName, role,
        profilepic: pp.secure_url
    });
    if (user) {
        fs.unlink(profilepic.path, (err) => {
            console.log(err);
        });
        const token = gettoken(user._id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const mailoption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to Monato",
            // text: `Welcome to Blog app.Your account has been created with email Id:${user.email}`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h1 style="color: #4CAF50;">Welcome to Monato!</h1>
      <p style="font-size: 16px;">
        Your account has been created with email Id: 
        <strong style="color: #000;">${user.email}</strong>
      </p>
      <p style="font-size: 14px; color: #777;">
        We're excited to have you onboard. Get started by ordering the foods!
      </p>`,
        };
        await transporter.sendMail(mailoption);
        const a = await User.findById(user._id).select("fullName email role profilepic _id");
        return success(res, "User created successfully", a);
    }
    else {
        return err(res, "Something went wrong");
    }
});
const signin = tryCatch(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return err(res, "Pls provide credentials");
    }
    const user = await User.findOne({ email });
    if (!user) {
        return err(res, "User not found");
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
        return err(res, "Incorrect password");
    }
    const token = gettoken(user._id);
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const u = await User.findById(user._id).select("fullName email _id  role profilepic");
    return success(res, "Login successfull !", u);
});
const signout = tryCatch(async (req, res) => {
    res.clearCookie("token");
    return success(res, "Logout successfull");
});
const getuser = tryCatch(async (req, res) => {
    const id = req.user;
    if (!id) {
        return err(res, "Not authenticated");
    }
    const user = await User.findById(id).select("fullName email _id role profilepic");
    if (!user) {
        return err(res, "User not found");
    }
    return success(res, "User found", user);
});
const resetotp = tryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return err(res, "Pls provide email");
    }
    let user = await User.findOne({ email });
    if (!user) {
        return err(res, "User not found");
    }
    const otp = 1000000 + Math.floor(Math.random() * 900000);
    const time = new Date(Date.now() + 5 * 60 * 1000);
    user.resetPasswordOtp = String(otp);
    user.resetPasswordOtpExp = time;
    await user.save();
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Monato OTP Verification",
        html: `
    <div style="font-family:sans-serif">
      <h2>Monato</h2>
      <p>Your reset password OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);
    return success(res, "Otp sent to the email");
});
const checkresetotp = tryCatch(async (req, res) => {
    const { otp, email } = req.body;
    if (!otp) {
        return err(res, "Pls provide otp");
    }
    const ot = String(otp);
    if (!email) {
        return err(res, "Pls provide email");
    }
    let user = await User.findOne({ email });
    if (!user) {
        return err(res, "User not found");
    }
    if (!user.resetPasswordOtp || user.resetPasswordOtp == null) {
        return err(res, "Pls try again");
    }
    if (user.resetPasswordOtp !== ot) {
        return err(res, "Otp doesnot match");
    }
    if (!user.resetPasswordOtpExp) {
        return err(res, "Something went wrong");
    }
    if (user.resetPasswordOtpExp < new Date(Date.now())) {
        return err(res, "Otp expired");
    }
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExp = null;
    await user.save();
    return success(res, "Otp verified");
});
const newpassword = tryCatch(async (req, res) => {
    const { newpassword, email, confirmpass } = req.body;
    if (!newpassword && !confirmpass) {
        return err(res, "Enter new password");
    }
    if (!email) {
        return err(res, "Pls enter email");
    }
    const user = await User.findOne({ email });
    if (!user) {
        return err(res, "User not found");
    }
    if (newpassword !== confirmpass) {
        return err(res, "New password and confirm doesnot match.");
    }
    if (!validator.isStrongPassword(newpassword)) {
        return err(res, "Pls enter strong password");
    }
    const hashe = await bcrypt.hash(newpassword, 10);
    user.password = hashe;
    await user.save();
    return success(res, "Password changed successfully");
});
const updateprofile = tryCatch(async (req, res) => {
    const { fullName, password } = req.body;
    const id = req.user;
    if (!id) {
        return err(res, "Not authenticated");
    }
    const files = req.files;
    const profilepic = files.profilepic?.[0];
    let user = await User.findById(id);
    if (!user) {
        return err(res, "User not found ");
    }
    if (fullName) {
        user.fullName = fullName;
    }
    if (password) {
        if (!validator.isStrongPassword(password)) {
            return err(res, "Pls enter strong password");
        }
        const hashed = await bcrypt.hash(password, 10);
        if (hashed) {
            user.password = hashed;
        }
    }
    if (profilepic) {
        const a = await cloudinary.uploader.upload(profilepic.path, { resource_type: "image" });
        if (!a) {
            return err(res, "Try again");
        }
        user.profilepic = a.secure_url;
        fs.unlink(profilepic.path, (err) => {
            console.log(err);
        });
    }
    await user.save();
    const b = await User.findById(id).select("-password");
    return success(res, "Profile updated", b);
});
export { signup, signin, signout, getuser, resetotp, checkresetotp, newpassword, updateprofile };
