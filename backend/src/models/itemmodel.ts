

import mongoose, { Types } from "mongoose"


interface IItem{
    itemname:string,
    price:number,
    desc:string,
    image:string,
    reviews:[Types.ObjectId]
}

const itemSchema = new mongoose.Schema<IItem>({
    itemname:{
            type:String,
            reqired:true
        },
        price:{
            type:Number,
            required:true
        },
        desc:{
            type:String,
        },
        image:{
            type:String,
            required:true
        },

        reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }]

},{timestamps:true})

const  Item = mongoose.model<IItem>("Item",itemSchema)
export default Item
