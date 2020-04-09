import * as express from "express";
import {validationResult} from "express-validator";
import * as sentry from "@sentry/node";
import {Sequelize} from "Sequelize-typescript";
import {Response} from "../helper/Response";
import {rules} from "../rules/Rule";
import {Cake} from "../models/Cake";
import {Ordernumber} from "../rules/Ordernumber";
import { Order, OrderInterface, OrderStatus } from "../models/Order";
import {NotificationDirector} from "../helper/NotificationDirector";
import {User, UserInterface, LoginInterface, ResetPasswordInterface} from "../models/User";
import { Wallet } from "../models/Wallet";
//import { WalletService } from "../rules/WalletService";


const response = new Response();
const ordernumber = new Ordernumber();
const notificationDirector = new NotificationDirector();
const wallet = new Wallet();
const user = new User();
//const walletservice = new WalletService();

export const OrderRouter = express.Router();  

OrderRouter.get("/", async (req: express.Request, res:express.Response)=>{
      const result = await Cake.findAll()
      res.json(response.success(result));

});

OrderRouter.post("/", rules.createorder, async (req: express.Request, res: express.Response) =>{
            try{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json(response.error({error: error.array()}, "Wrong Input"));
        }
         const payload = req.body as OrderInterface;
         if(wallet.balance <= payload.amount){
          return res.status(422).json(response.error({error: error.array()}, "Insufficient Balance to place your order"));    
         }
          {
          payload.status = OrderStatus.Pending;  
          payload.paid = true;
          payload.order_number = await ordernumber.generateOrderNumber();           
          let order = new Order(payload);
           const result = await order.save(); 
           notificationDirector.setTopic(NotificationDirector.ADMIN_TOPIC)
           .setNotification(`Order ${payload.order_number}`, "You have an order")
            .sendToTopic();
            
            if (order.user.push_token !== "") {
                  notificationDirector.setToken(order.user.push_token)
                      .setNotification(`Your ${order} Order`,
                          ` your order has been placed successfully`).send();
            }
           return  res.json(response.success({message: result}));              
            }
            }
             catch(err){
                sentry.captureException(err);
                return  res.status(400).json(response.error(err, "oops an error has occured"));
             }
            });
    
            
    OrderRouter.put("/:id", async (req: express.Request, res: express.Response)=>{
         const status = req.body.status
      let userNotificationMessage: string = "";
            try{
          const order = await Order.findByPk(req.params.id);
          
            if( order.status === OrderStatus.Completed){
                  return  res.json(response.success({message: "We can not change the status of your order"}));       
            }
             const nwallet = Wallet.findOne({where : {user_id : order.user_id}});
             switch(status){
                   case OrderStatus.Declined: {
                        userNotificationMessage = `Your order ${order.order_number} has been declined`;
                        order.status = status;
                        break;
                   }

            case OrderStatus.Processing: {
                  if(wallet.balance >=  order.amount){
                        order.status = status;
                        wallet.ledger_balance -= order.amount;
                        await wallet.save();
                        userNotificationMessage = `Your order ${order.order_number} has been declined`;
                        order.status = status;
                        }
          else{
            return res.status(400).json(response.error({},
                  "Insufficient user account balance, cannot process this order"));
                  }
                  break;
          }
          case OrderStatus.Completed: {
                order.status = status;
            const note = `Wallet debit for order ${order.order_number}`;
          //  await walletservice.debitWallet(wallet.user_id, order.amount, note, false);
            order.status = status;
            userNotificationMessage = `Your order has been completed successfully`;
            order.status = status;
            break;
        }
            }
                  
            notificationDirector.setToken(order.user.push_token)
            .setNotification(`Order ${order.order_number}`, userNotificationMessage)
            .send();
             }
             
           catch(err){
                  sentry.captureException(err);
                 console.error("oops an error occured", err);
                 return res.status(400).json(response.error({error: err}, err));
                  }
            });
