import {Sequelize} from "sequelize-typescript";
import * as express from "express";
import * as sentry  from "@sentry/node";
import {validationResult} from "express-validator";
import {rules} from "../rules/Rule";
import {Bank, CreateBankModel} from "../models/Bank";
import {Response} from "../helper/Response";

const response = new Response();
export const BankRouter = express.Router();


BankRouter.post("/", rules.creatBank, async (req: express.Request, res: express.Response) => {
     try{
  const error = validationResult(req);
  if(!error.isEmpty()){
      return res.status(422).json(
        response.error({ error: error.array() }, "failed validation error"),);
      }  
      const payload = req.body as CreateBankModel;
      const bank = await Bank.create(payload);
      return res.json(response.success(bank));
       }
     catch(err){
         sentry.captureException(err);
         return  res.status(400).json(response.error(err, "oops an error has occured"));
              }
    });


     BankRouter.get("/all" , async (req:express.Request, res: express.Response) => {
     try{
        let activated = {};
        if (req.query.activated) {
            activated = {activated: req.query.activated};
        }
         const bank = await Bank.findAll({where : activated,});
         res.json(response.success(bank));
     }
          catch(err){
            sentry.captureException(err);
            return  res.status(400).json(response.error(err, "oops an error has occured"));
                 }
         });

         BankRouter.put("/:id" , rules.creatBank,  async (req:express.Request, res: express.Response) => {
            try{
                const error = validationResult(req);
                     if(!error.isEmpty()){
                   return res.status(422).json(
               response.error({ error: error.array() }, "failed validation error"),);
            }  
            const payload = req.body as CreateBankModel;
                const bank = await Bank.update(payload, {where: {id : req.params.id}});
                const updatebank = await Bank.findByPk(req.params.id);
                res.json(response.success(updatebank));
            }
                 catch(err){
                   sentry.captureException(err);
                   return  res.status(400).json(response.error(err, "Unable o update Bank"));
                        }
                });

    
     


