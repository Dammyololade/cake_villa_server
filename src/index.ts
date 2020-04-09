import express from 'express';
import {sequelize} from "./sequelize";
import { createServer } from "http";
import bodyParser = require("body-parser");
import * as routes from './routes';



const app = express();
const port = 8000;


// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: "5mb"}));

// configure routes
routes.register(app);


app.get('/', (req, res) => {
  res.send('Welcome to the landing page of Cake Home & Event Villa!!! ');
});

(async () => {
    try {
      await sequelize.authenticate();
        console.info("Sequelize is Up and Runing.. Move on....");
    } catch (e) {
        console.error("Sequelize failed to start up", e);}
    
 /*
   await sequelize.sync({force: false, alter: true}).then((val) => {
        console.log("success sync sequelize");
    }).catch((err) => {
        console.error("SEQUELIZE: Error occurs", err);
    }); 
 */
   
    createServer(app).listen(port, () => {
        return console.info(`server started at http://localhost:${port}`);
    });
  });