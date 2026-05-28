import mongoose from "mongoose";



interface IUser {

    fullName:string,
    email:string,
    password:string,
    resetPasswordOtp:string
    resetPasswordOtpExp:Date | null
    role:string,
    profilepic:string
}

const userSchema= new mongoose.Schema<IUser>({

    fullName:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6

    },
resetPasswordOtp:{
    type:String,

},
role:{
type:String,
enum:["user","resturant","rider"]

},
resetPasswordOtpExp:{
    type:Date || null,
    default:null
},
profilepic:{
    type:String,
    required:true
},

},{timestamps:true})

const User = mongoose.model<IUser>("User",userSchema)
export default User