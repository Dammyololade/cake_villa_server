import * as express from "express";
import {validationResult, Result} from "express-validator";
import * as sentry from "@sentry/node";
import {Sequelize} from "Sequelize-typescript";
import {User} from "../models/User";
import {rules} from "../rules/Rule";
import {Response} from "../helper/Response";
import { CakeInterface, Cake } from "../models/Cake";
import { Favourite } from "../models/Favourite";

 const response = new Response();

 export const AdminRouter = express.Router();

  AdminRouter.get("/", async (req: express.Request, res: express.Response) => {
      try{
    const regis = await User.findAll();
      return res.json(response.success(regis));
      }
      catch(err){
        sentry.captureException(err);
      return  res.status(400).json(response.error(err, "oops an error has occured"));
    }
        });
    
    

  AdminRouter.get("/:id", async (req: express.Request, res: express.Response) => {
      try{
       const error = validationResult(req.params);
        if(!error.isEmpty()){
            return res.status(422).json(
                response.error({error: error.array()}, "Invalid Id")
            )
        }
        const result = await User.findByPk(req.params.id);
        return res.json(response.success(result));
      }
      catch(err){
          sentry.captureException(err);
         return res.status(400).json(response.error(err, "oops an error has occured"));
      }
  });

   
   AdminRouter.post("/upload", rules.createcake, async (req: express.Request, res: express.Response) =>{
       try{
         const error = validationResult(req);
          if(!error.isEmpty()){
              return res.status(422).json(
                response.error({error: error.array()}, "Invalid Input")
              )
          }
         const payload = req.body as CakeInterface;
           const cakes = new Cake(payload);
           const result = await cakes.save() 
           return res.json(response.success(result));    
  
        }
       catch(err){
        sentry.captureException(err);
        return  res.status(400).json(response.error(err, "oops an error has occured"));
       }
   });

   AdminRouter.get("/cake/:id", async (req: express.Request, res: express.Response) => {
    try{
     const error = validationResult(req.params);
      if(!error.isEmpty()){
          return res.status(422).json(
              response.error({error: error.array()}, "Invalid Id")
          )
      }
      const result = await Cake.findByPk(req.params.id);
      return res.json(response.success(result));
    }
    catch(err){
        sentry.captureException(err);
       return res.status(400).json(response.error(err, "oops an error has occured"));
    }
}); 

  AdminRouter.delete("/delete",  async (req: express.Request, res: express.Response)=>{
       try{
         const user_id = req.body.user_id;
           if(user_id === ""){
            return res.status(422).json(
              response.error("Invalid Id"));
           }
           const result = await User.findByPk(user_id);
           await result.destroy();
           return res.json(response.success("successful"));
       }
       catch(err){
         sentry.captureException(err);
         return res.json(response.error(err, "oops an error has occured"));
       }
       });
    
              