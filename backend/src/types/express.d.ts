import { Express } from "express";
import type { Types } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      user?: Types.ObjectId

      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[];
        
      file?: Express.Multer.File;
    }
  }
}

export {};