import * as sentry from "@sentry/node";
import * as express from "express";
import {validationResult} from "express-validator";
import {rules} from "../rules/Rule";
import {Message, MessageInterface} from "../models/Message";
import {Sequelize} from "Sequelize-typescript";
import {User} from "../models/User";
import {Response} from "../helper/Response";
import {auth} from "../middleware/auth";
import { NotificationDirector } from "../helper/NotificationDirector";

const response = new Response();
const notificationDirector = new NotificationDirector();

export const MessageRouter = express.Router();

MessageRouter.post("/", rules.createMessage, async (req: express.Request, res: express.Response)=> {
     try{
   const error = validationResult(req);
   if(!error.isEmpty()){
   return res.status(422).json(
        response.error({error: error.array()}, "Invalid Id"));
   }
    const payload = req.body as MessageInterface;
    const message = new Message(payload);
     const result = await message.save();

     const user = await User.findByPk(payload.user_id);

     if(user.push_token = ""){
         notificationDirector.setNotification(
             "You have a new Message" ,
             "New Message from Admin"
         ).setToken(user.push_token).send();
     }
     res.json(response.success(result));
    } catch (err) {
    sentry.captureException(err);
    return res.status(400).json(response.error(err, "oops an error has occured"));
    }
});

MessageRouter.get("/view", auth, async (req: express.Request, res: express.Response)=>{
       try{
    const result = await Message.findAll();
      return res.json(response.success({message: result}));
       }
       catch(err){
           sentry.captureException(err);
          return res.json(response.error(err, "oops an error has occured" ));
       }
});

MessageRouter.get("/:id", auth, async (req: express.Request, res: express.Response)=>{
    try{
 const result = await Message.findByPk(req.params.id);
   return res.json(response.success({message: result}));
    }
    catch(err){
        sentry.captureException(err);
       return res.json(response.error(err, "oops an error has occured" ));
    }
});