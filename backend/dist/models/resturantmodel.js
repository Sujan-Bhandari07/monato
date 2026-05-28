import mongoose, { Types } from "mongoose";
const resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isopen: {
        type: Boolean,
        default: false,
    },
    menu: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });
const Resturant = mongoose.model("Resturant", resturantSchema);
export { Resturant };
