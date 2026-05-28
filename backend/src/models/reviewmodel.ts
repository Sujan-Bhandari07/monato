import mongoose, { Types } from "mongoose";

interface IReviews{

    user:Types.ObjectId,
    comment:string,
    profilepic:string

}

const reviewSchema = new mongoose.Schema<IReviews>({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
comment:{
    type:String,

    required:true
},


    
},{timestamps:true})


const Review = mongoose.model<IReviews>("Review",reviewSchema)
export{Review}