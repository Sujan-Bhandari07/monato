import mongoose, { Types } from "mongoose";
const itemSchema = new mongoose.Schema({
    itemname: {
        type: String,
        reqired: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }]
}, { timestamps: true });
const Item = mongoose.model("Item", itemSchema);
export default Item;
