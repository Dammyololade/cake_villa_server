import * as express from "express";
import {UserRouter} from "./UserRouter";
import {AdminRouter} from "./AdminRouter";
import { OrderRouter } from "./OrderRouter";
import { FavouritesRouter } from "./FavoritesRouter";
import { MessageRouter } from "./MessageRouter";
import {BankRouter} from "./BankRouter";
//import {walletFundingRouter} from "./WalletFundingRouter";


export const register = ( app: express.Application) => {
         
    app.use("/app/admin", AdminRouter);
   app.use("/app/user", UserRouter);
   app.use("/app/order", OrderRouter);
   app.use("/app/favourite", FavouritesRouter);
   app.use("/app/message", MessageRouter);
   app.use("/app/bank", BankRouter);
   //app.use("/app/Fundwallet", walletFundingRouter);
   
    
}