import mongoose from "mongoose";
const menuSchema = new mongoose.Schema({
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
    reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }]
});
