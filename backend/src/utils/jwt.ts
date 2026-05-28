import jwt from "jsonwebtoken"
import type { Types } from "mongoose"


const gettoken = (id:Types.ObjectId)=>{

    return jwt.sign({_id:id},process.env.JWT_SECRET as string ,{expiresIn:"7d"})

}
export {gettoken}