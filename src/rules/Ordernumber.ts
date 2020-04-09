import * as express from "express";
import { Order } from "../models/Order";



export class Ordernumber{

    public async generateOrderNumber() : Promise <string> {
        let ordernumber = "SOT";
do {
    const number = "abcdefghijklmnopqrtuvwxyz0123456789";
    for (let  i = 0; i <= number.length; i++){
        ordernumber += number.charAt(Math.floor(Math.random() * number.length));
    }
}while (await Order.findOne({where: {order_number: ordernumber}})
);
return ordernumber;
    }

}
