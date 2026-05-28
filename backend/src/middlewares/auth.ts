import { err } from "../utils/response.js";
import  { tryCatch } from "../utils/TryCatch.js";
import jwt, { type JwtPayload } from "jsonwebtoken"

const authmiddleware = tryCatch(async(req,res,next)=>{
const token = req.cookies.token
if(!token){
    return err(res,"Not authenticated")
}
const verify = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload
if(!verify){
    return err(res,"Not authenticated")
}

req.user=verify._id
next()

    
})

export{authmiddleware}