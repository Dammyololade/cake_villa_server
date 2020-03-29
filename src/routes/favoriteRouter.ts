import * as express from "express";
import * as sentry from "@sentry/node";
import {Favourite, FavouriteInterface} from "../model/Favourite";
import {Response}   from "../helper/Response";
import {rules} from "../rules/Rule";
import { validationResult } from "express-validator";
import { Order } from "../model/Order";
import { orderRouter } from "./OrderRouter";
import { User } from "../model/User";

const response = new Response();

export const favouriteRouter = express.Router();

favouriteRouter.get("/", rules.createfavourite, async (req: express.Request, res: express.Response)=> {
    try{
     const error = validationResult(req);
     if(!error.isEmpty()){
        return res.status(422).json(
            response.error({error: error.array()}, "Invalid entrys")
        )
     }
      const payload = req.body as FavouriteInterface
      const favourite = new Favourite(payload);
      const result = await favourite.save();
       return res.json(response.success(result));
    }
     catch(err){
        sentry.captureException(err);
        return  res.status(400).json(response.error(err, "oops an error has occured"));
     }
     });

