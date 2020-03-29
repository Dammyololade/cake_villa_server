import * as express from "express";
import {userRouter} from "../routes/userRouter";
import {adminRouter} from "../routes/adminRouter";
import { orderRouter } from "./OrderRouter";
import { favouriteRouter } from "./favoriteRouter";
import { messageRouter } from "./messageRouter";

export const register = ( app: express.Application) => {
         
    app.use("api/admin", adminRouter);
   app.use("app/user", userRouter);
   app.use("app/order", orderRouter);
   app.use("app/favorite", favouriteRouter);
   app.use("app/message", messageRouter);
    
}