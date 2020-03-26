import * as express from "express";
import {validationResult} from "express-validator";
import * as sentry from "@sentry/node";
import {Sequelize} from "Sequelize-typescript";
import {Registration} from "../model/Registration";
import {rules} from "../rules/Rule";
import {Response} from "../helper/Response";
import { CakeCreateModel, Cakes } from "../model/Cakes";
import { Favourite } from "../model/Favourite";

 const response = new Response();

 export const adminRouter = express.Router();

  adminRouter.get("/", async (req: express.Request, res: express.Response) => {
      try{
    const regis = await Registration.findAll();
      return res.json(response.success(regis));
      }
      catch(err){
        sentry.captureException(err);
      return  res.status(400).json(response.error(err, "oops an error has occured"));
    }
        });
    
    

  adminRouter.get("/:id", async (req: express.Request, res: express.Response) => {
      try{
       const error = validationResult(req.params);
        if(error.isEmpty()){
            return res.status(422).json(
                response.error({error: error.array()}, "Invalid Id")
            )
        }
        const result = await Registration.findByPk(req.params.id);
        return res.json(response.success(result));
      }
      catch(err){
          sentry.captureException(err);
         return res.status(400).json(response.error(err, "oops an error has occured"));
      }
  });

    adminRouter.get("/count", async (req: express.Request, res: express.Response) => {
        try{
           const rcount = await Registration.findAndCountAll();
            const result = rcount.count;
            res.json(response.success(result));
        }
        catch(err){
            sentry.captureException(err);
        return  res.status(400).json(response.error(err, "oops an error has occured"));
        }
    });

   adminRouter.post("/upload", rules.createcake, async (req: express.Request, res: express.Response) =>{
       try{
         const error = validationResult(req);
          if(!error.isEmpty()){
              return res.status(422).json(
                response.error({error: error.array()}, "Invalid Inout")
              )
          }
         const payload = req.body as CakeCreateModel;
         const image1 = req.body.image.filename
             payload.image = image1
          const cakes = new Cakes(payload);
           const result = await cakes.save() 
           return res.json(response.success(result));    
  
        }
       catch(err){
        sentry.captureException(err);
        return  res.status(400).json(response.error(err, "oops an error has occured"));
       }
   });

     adminRouter.get("/favourite", async (req: express.Request, res: express.Response)=> {
      try{ 
      const result = await Cakes.max("cake_id");
       return res.json(response.success(result));    
  
      }
       catch(err){
      sentry.captureException(err);
      return  res.status(400).json(response.error(err, "oops an error has occured"));
     }
      });
  