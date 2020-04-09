import {Sequelize} from "sequelize-typescript";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import {AdminService} from "../rules/AdminService";
import {NotificationDirector} from "../helper/NotificationDirector";
import {Response} from "../helper/Response";
import {User} from "../models/User";
import { header } from "express-validator";

const notificationDirector = new NotificationDirector();
const user = new User();
const adminService = new AdminService();
const response = new Response();

  
    export const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
         const token = (req.headers || req.query.token || req.body.token || "");
          const verytoken = await adminService.verifyToken(token);
         if (!verytoken) {
             return res.status(401).json(
                 response.error({}, "Unauthorized token"),
                 );
         }
         next();
     };
       
   


