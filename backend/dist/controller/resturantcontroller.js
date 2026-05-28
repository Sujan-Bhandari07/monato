import cloudinary from "../config/cloudinary.js";
import Item from "../models/itemmodel.js";
import { Resturant } from "../models/resturantmodel.js";
import { Review } from "../models/reviewmodel.js";
import { err, success } from "../utils/response.js";
import { tryCatch } from "../utils/TryCatch.js";
import fs from "fs";
const addresturant = tryCatch(async (req, res) => {
    const { name, address } = req.body;
    const id = req.user;
    if (!id) {
        return err(res, "Not authenticated");
    }
    if (!name || !address) {
        return err(res, "Pls provide all information");
    }
    const files = req.files;
    const image = files.image?.[0];
    if (!image) {
        return err(res, "Pls provide the banner of resturant");
    }
    const a = await cloudinary.uploader.upload(image.path, {
        resource_type: "image"
    });
    if (!a) {
        return err(res, "Cloudinary problem");
    }
    const resturant = await Resturant.create({
        name,
        owner: id,
        address,
        image: a.secure_url
    });
    fs.unlink(image.path, (err) => {
        console.log(err);
    });
    return success(res, "Resturant created", resturant);
});
const addmenu = tryCatch(async (req, res) => {
    const { itemname, price, desc, resturantid } = req.body;
    if (!itemname || !price || !desc) {
        return err(res, "Pls provide menu");
    }
    if (!resturantid) {
        return err(res, "Pls provide resturant id");
    }
    const files = req.files;
    const image = files.image?.[0];
    if (!image) {
        return err(res, "Pls provide the image of item");
    }
    const a = await cloudinary.uploader.upload(image.path, {
        resource_type: "image"
    });
    if (!a) {
        return err(res, "Cloudinary problem");
    }
    const item = await Item.create({
        itemname,
        price: Number(price),
        desc,
        image: a.secure_url
    });
    fs.unlink(image.path, (err) => {
        console.log(err);
    });
    if (!item) {
        return err(res, "Cannot create item");
    }
    const r = await Resturant.findById(resturantid);
    if (r) {
        r.menu.push(item._id);
    }
    await r?.save();
    return success(res, "Item created", item);
});
const addreview = tryCatch(async (req, res) => {
    const id = req.user;
    const { comment, itemid } = req.body;
    if (!id) {
        return err(res, "Not authenticated");
    }
    if (!comment || !itemid) {
        return err(res, "pls provide information");
    }
    const review = await Review.create({
        user: id,
        comment
    });
    if (!review) {
        return err(res, "Cannot create comment");
    }
    const item = await Item.findById(itemid);
    item?.reviews.push(review._id);
    await item?.save();
    return success(res, "Commented");
});
const getresturantbyid = tryCatch(async (req, res) => {
    const { resturantid } = req.body;
    console.log(resturantid);
    if (!resturantid) {
        return err(res, "Pls provide the resturant id");
    }
    const a = await Resturant.findById(resturantid).populate({
        path: "menu",
        populate: {
            path: "reviews",
            populate: {
                path: "user",
                select: "fullName profilepic"
            }
        }
    });
    if (!a) {
        return err(res, "cannot find resturant");
    }
    return success(res, "found", a);
});
const getallresturant = tryCatch(async (req, res) => {
    const resturants = await Resturant.find({}).select("image address name");
    if (resturants.length > 0) {
        return success(res, "found", resturants);
    }
    else {
        return err(res, "Cannot find any resturant");
    }
});
const openorclose = tryCatch(async (req, res) => {
    const { restid } = req.body;
    if (!restid) {
        return err(res, "Resturant not found");
    }
    const a = await Resturant.findById(restid);
    if (a) {
        a.isopen = !a.isopen;
    }
    await a?.save();
    return success(res, "changed", a);
});
export { addmenu, addresturant, addreview, getallresturant, getresturantbyid, openorclose };
