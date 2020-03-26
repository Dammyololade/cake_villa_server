import * as express from "express";
import {userRouter} from "../routes/userRouter";
import {adminRouter} from "../routes/adminRouter";

export const register = ( app: express.Application) => {
         
    app.use("app/admin", adminRouter);
   app.use("app/user", userRouter);
    
}