import mongoose, { Types } from "mongoose";



interface IResturant{
    name:string,
    owner:Types.ObjectId,
    image:string,
    address:string,
    isopen:boolean,
    menu:[Types.ObjectId]
}

const resturantSchema = new mongoose.Schema<IResturant>({

    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },

    isopen:{
        type:Boolean,
        default:false,
        
    },
    menu:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String,
        required:true
    }
    

},{timestamps:true})


const Resturant = mongoose.model<IResturant>("Resturant",resturantSchema)
export {Resturant}