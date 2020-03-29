import * as express from "express";
import {validationResult} from "express-validator";
import * as sentry from "@sentry/node";
import {Sequelize} from "Sequelize-typescript";
import {Response} from "../helper/Response";
import {rules} from "../rules/Rule";
import {Cake} from "../model/Cake";
import {Ordernumber} from "../rules/Ordernumber";
import { Order, OrderInterface, OrderStatus } from "../model/Order";
import {NotificationDirector} from "../helper/NotificationDirector";
import {User, UserInterface, LoginInterface, ResetpasswordInterface} from "../model/User";


const response = new Response();
const ordernumber = new Ordernumber();
const notificationDirector = new NotificationDirector();

export const orderRouter = express.Router();  

orderRouter.get("/", async (req: express.Request, res:express.Response)=>{
      const result = await Cake.findAll()
      res.json(response.success(result));

});

orderRouter.post("/", rules.createorder, async (req: express.Request, res: express.Response) =>{
     try{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json(response.error({error: error.array()}, "Wrong Input"));
        }
         const payload = req.body as OrderInterface;
          payload.status = OrderStatus.Pending;  
          payload.order_number = await ordernumber.generateOrderNumber();
          payload.created_date = new Date();                 
          let order = new Order(payload);
           const result = await order.save(); 
           notificationDirector.setTopic(NotificationDirector.ADMIN_TOPIC)
           .setNotification(`Order ${payload.order_number}`, "You have an order")
            .sendToTopic();
           return  res.json(response.success({message: result}));              
             }
             catch(err){
                sentry.captureException(err);
                return  res.status(400).json(response.error(err, "oops an error has occured"));
             }
            });
    
