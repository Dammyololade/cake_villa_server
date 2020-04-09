import {Sequelize} from "sequelize-typescript";
import request from "request-promise";
import * as jwt from "jsonwebtoken";
import { response } from "express";



export class AdminService {
    
    public async generateToken(email: string, name: string): Promise <string>{
   return await jwt.sign({email, name}, process.env.jwtprivatekey);
         }
   
    public async verifyToken(token: string): Promise <boolean> {
    try{
        const very = await jwt.verify(token, process.env.jwtprivatekey);
        if(!very){
            return false;
           }
        return true;
    }   
   catch(err){
      return err;
   }
    }

}
  