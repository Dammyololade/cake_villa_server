import * as express from "express";
import {validationResult} from "express-validator";
import * as sentry from "@sentry/node";
import {Sequelize} from "Sequelize-typescript";
import {Response} from "../helper/Response";
import {rules} from "../rules/Rule";
import {Cakes} from "../model/Cakes";
import {Ordernumber} from "../rules/Ordernumber";
import { Order, orderCreateModel, OrderStatus } from "../model/Order";



const response = new Response();
const ordernumber = new Ordernumber();

export const orderRouter = express.Router();  

orderRouter.get("/", async (req: express.Request, res:express.Response)=>{
      const result = await Cakes.findAll()
      res.json(response.success(result));

});

orderRouter.post("/", rules.createorder, async (req: express.Request, res: express.Response) =>{
     try{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json(response.error({error: error.array()}, "Wrong Input"));
        }
         const payload = req.body as orderCreateModel;
          payload.status = OrderStatus.Pending;  
          payload.order_number = await ordernumber.generateOrderNumber();
          payload.created_date = new Date();                 
          const order = new Order(payload);
           const result = await order.save(); 
           return  res.json(response.success(result));              
             }
             catch(err){
                sentry.captureException(err);
                return  res.status(400).json(response.error(err, "oops an error has occured"));
             }
            });
    
