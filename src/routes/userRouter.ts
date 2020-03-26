import {Sequelize} from "sequelize-typescript";
import * as Sentry from "@sentry/node";
import * as express from "express";
import * as bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import {Response} from "../helper/Response";
import {Registration, RegistrationCreateModel, LoginCreateModel, ResetpasswordCteateModel} from "../model/Registration";
import {rules} from "../rules/Rule";

const response = new Response();
export const userRouter = express.Router();

userRouter.post("/register", rules.createregistration, async (req: express.Request, res: express.Response) =>{
    try{
     const error = validationResult(req);
     if(!error.isEmpty()){
         return res.status(422).json(
            response.error({error: error.array()}, "failed, validation error"),
          ) }
     const payload = req.body as RegistrationCreateModel;
     const exrecord = await Registration.findOne( { where: {email: payload.email}});
      if(exrecord){
          return res.json(response.success("Email Already Exsist"));
      }
       const salt = await bcrypt.gensalt(10);
     const hashpassword = await bcrypt.hash(payload.password, salt);
     payload.password = hashpassword;
      const registration = await new Registration(payload);
            const result = await registration.save();
              res.json(response.success(result));
            } catch (err) {
            Sentry.captureException(err);
            return res.status(400).json(response.error(err, "oops an error has occured"));
            }
     });


        userRouter.post("/login", rules.createlogin, async (req: express.Request, res: express.Response) =>{
          const error = validationResult(req);
          if(!error.isEmpty()){
              return res.status(422).json(
                  response.error({error: error.array()},"failed, validation error"),
              )
          }
             const payload = req.body as LoginCreateModel;
             try{
             const exuser = await Registration.findOne({where: { email : payload.email}
             });
             if(!exuser){
                return res.json(
                    response.error({error: error.array()},"E-Mail does not exsist"),
                )
             }
             const valipassword = await bcrypt.compare(payload.password);
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

         userRouter.put("/reset-password", rules.createresetpassword, async (req: express.Request, res: express.Response)=>{
             try{
          const error = validationResult(req);
          if(!error.isEmpty()){
            return res.status(422).json
            (response.error({error: error.array()}, "failed, validation error" ))
          }
           const payload = req.body as ResetpasswordCteateModel
           const nemail = await Registration.findOne({where: { 
               email : payload.email    
           }});
             if(!nemail){
                 return res.json(response.success({message: "Wrong Email Address"}));
             }
              if(payload.newpassword === payload.retype_password){
              const nsalt = await bcrypt.gensalt(10);
              const hashpass = await bcrypt.hash(payload.retype_password, nsalt);
              payload.newpassword = hashpass;
              await nemail.update({password:payload.newpassword});
              return res.json(response.success({message: "successful"}));
              }
            }
            catch(err){
                Sentry.captureException(err);
                return res.status(400).json(response.error(err, "oops an error has occured"));
            }
         });

         userRouter.put("/:id", rules.createregistration, async (req: express.Request, res: express.Response) =>{
             try{
                 const error = validationResult(req);
                  if(!error.isEmpty()){
                     return res.status(422).json(
                    response.error({error: error.array()}, "failed, validation error"),
                  ) }
                  const payload = req.body as RegistrationCreateModel
               const result = await Registration.findByPk(req.params.id);
                 result.update(payload);
                    }
            catch(err){
                Sentry.captureException(err);
              return res.status(400).json(response.error(err, "oops an error has occured"));
               }
             
         });