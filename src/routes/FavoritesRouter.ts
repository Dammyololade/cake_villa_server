import * as express from "express";
import * as sentry from "@sentry/node";
import {Favourite, FavouriteInterface} from "../models/Favourite";
import {Response}   from "../helper/Response";
import {rules} from "../rules/Rule";
import { validationResult } from "express-validator";
import * as _ from "lodash";
import { where } from "sequelize/types";

const response = new Response();

export const FavouritesRouter = express.Router();

FavouritesRouter.post("/", rules.createfavourite, async (req: express.Request, res: express.Response)=> {
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

     FavouritesRouter.get("/favourite", async (req: express.Request, res: express.Response)=> {
      try{ 
         const favourite = await Favourite.findAll();
         console.log(favourite);
        return res.json(response.success(favourite));
          }
       catch(err){
      sentry.captureException(err);
      return  res.status(400).json(response.error(err, "oops an error has occured"));
     }
      });

      FavouritesRouter.get("/max", async (req: express.Request, res: express.Response)=> {
                          
            try{ 
              let maxCounter = 0;
              let element = 0;
              const arrlent = await Favourite.max("id");
                                           
   console.log(arrlent);
            for(let i = 1; i <= arrlent; ++i){
                let counter = 1;
              for(let j = i +1; j <= arrlent; ++j){
             let resul1 = await Favourite.sum("cake_id", {where :
                {id :i}});

             let resul2 = await Favourite.sum("cake_id", {where :
               {id : j}});
             if(resul1 === resul2){
               counter++;
             }
            }
               if(maxCounter < counter){
                 maxCounter = counter;
                let element = await Favourite.sum("cake_id", {where :
                  { id : i}});
                    }
              }
              return res.json(response.success(maxCounter));
                             
              }
            catch(err){
              sentry.captureException(err);
      return  res.status(400).json(response.error(err, "oops an error has occured"));
     }
      });
