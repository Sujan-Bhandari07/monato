import mongoose, { Types } from "mongoose";
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true });
const Review = mongoose.model("Review", reviewSchema);
export { Review };
