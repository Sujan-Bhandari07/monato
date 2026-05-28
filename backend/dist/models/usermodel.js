import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    resetPasswordOtp: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "resturant", "rider"]
    },
    resetPasswordOtpExp: {
        type: Date || null,
        default: null
    },
    profilepic: {
        type: String,
        required: true
    },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
