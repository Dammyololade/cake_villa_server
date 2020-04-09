import {Sequelize} from "sequelize-typescript";
import * as Sentry from "@sentry/node";
import * as express from "express";
import * as bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import {Response} from "../helper/Response";
import {User, UserInterface, LoginInterface, ResetPasswordInterface, ChangePasswordInterface} from "../models/User";
import {rules} from "../rules/Rule";
import {NotificationDirector} from "../helper/NotificationDirector";
import { AdminService } from "../rules/AdminService";
import {Wallet} from "../models/Wallet";


const response = new Response();
const notificationDirector = new NotificationDirector();
const adminService = new AdminService();
export const UserRouter = express.Router();
const saltRounds = 10;

UserRouter.post("/register", rules.createregistration, async (req: express.Request, res: express.Response) =>{
    try{
     const error = validationResult(req);
     if(!error.isEmpty()){
         return res.status(422).json(
            response.error({error: error.array()}, "failed, validation error"),
          ) }
     const payload = req.body as UserInterface;
     const exrecord = await User.findOne( { where: {email: payload.email}});
      if(exrecord){
          return res.json(response.success("Email Already Exsist"));
      }          
       
     const hashpassword = await bcrypt.hash(payload.password, saltRounds);
    payload.password = hashpassword;
    if(payload.admin === true){
        const token = await adminService.generateToken(payload.email, payload.fullname);
        res.header(token);
    }

       const user = await new User(payload);
        const result = await user.save();
           await Wallet.create({
           user_id :user.id,
            balance : 0,
             });
              res.json(response.success(result));
            } catch (err) {
               Sentry.captureException(err);
            return res.status(400).json(response.error(err, "oops an error has occured"));
            }
     });


        UserRouter.post("/login", rules.createlogin, async (req: express.Request, res: express.Response) =>{
          const error = validationResult(req);
          if(!error.isEmpty()){
              return res.status(422).json(
                  response.error({error: error.array()},"failed, validation error"),
              )
          }
             const payload = req.body as LoginInterface;
             try{
             const exuser = await User.findOne({where: { email : payload.email}
             });
             if(!exuser){
                return res.json(
                    response.error({error: error.array()},"E-Mail does not exsist"),
                )
             }
             const valipassword = await bcrypt.compare(payload.password, exuser.password);
             if(!valipassword){
             return res.json(
                response.error({error: error.array()},"Wrong Password"),
            )
         }
        return res.json(response.success({message : "Success"}));
             }
             catch(err){
                 Sentry.captureException(err);
                 return res.status(400).json(response.error({error: error.array()}, "oops an error has occured"));
             }
         });

         UserRouter.put("/reset-password", rules.createresetpassword, async (req: express.Request, res: express.Response)=>{
             try{
          const error = validationResult(req);
          if(!error.isEmpty()){
            return res.status(422).json
            (response.error({error: error.array()}, "failed, validation error" ))
          }
           const payload = req.body as ResetPasswordInterface
           const nemail = await User.findOne({where: { 
               email : payload.email    
           }});
             if(!nemail){
                 return res.json(response.success({message: "Wrong Email Address"}));
             }
              if(payload.newpassword === payload.retype_password){
              nemail.password = await bcrypt.hash(payload.retype_password, saltRounds);
               await nemail.save();
              return res.json(response.success({message: "successful"}));
              }
              
            }
            catch(err){
                Sentry.captureException(err);
                return res.status(400).json(response.error(err, "oops an error has occured"));
            }
         });

         UserRouter.put("/changepassword", rules.changepassword, async (req: express.Request, res: express.Response)=> {
             try{
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(422).json(
                    response.error({error: error.array()}, "failed, validation error"),)
            }
              const payload = req.body as ChangePasswordInterface
              const user = await User.findOne({where: { email: payload.email}});
              if (user == null) {
                return false;
            }
              const test =  await bcrypt.compare( payload.oldpassword, user.password);
                 if(!test){
                    return  res.json(response.success({message : "old passord is incorrect"}));
                     }
                     if(payload.newpassword === payload.confirmpassword){
                user.password = await bcrypt.hash(payload.newpassword, saltRounds);
                    user.save();
                    return res.json(response.success({message : "Success"}));
                     }
                     else {
                         return res.json(response.success({message : "recheck your entries"}));
                     }
         }
           catch(err){
               Sentry.captureException(err);
               return res.status(400).json(response.error(err, "oops an error has occured"));
           }
                     });

         UserRouter.put("/:id", rules.createregistration, async (req: express.Request, res: express.Response) =>{
             try{
                 const error = validationResult(req);
                  if(!error.isEmpty()){
                     return res.status(422).json(
                    response.error({error: error.array()}, "failed, validation error"),
                  ) }
                  const payload = req.body as UserInterface
                  const result = await User.findByPk(req.params.id);
                      const hashpassword = await bcrypt.hash(payload.password, saltRounds);
                   payload.password = hashpassword;
                const newresult = await result.update(payload);
                return res.json(response.success(newresult));

                    }
            catch(err){
               Sentry.captureException(err);
               return res.status(400).json(response.error(err, "oops an error has occured"));
               }
             
         });