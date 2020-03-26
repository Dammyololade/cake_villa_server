import {Column, Model, Table, UpdatedAt, CreatedAt, BelongsTo} from "sequelize-typescript";
import { Cakes } from "./Cakes";
import { Order } from "./Order";

Table({
    tableName: "favourite",
})

export class Favourite extends Model <Favourite> {
 @Column
 cake_id: number;

 @Column
 user_id: number;

 @CreatedAt
 @Column
 createdOn! : Date;

 @UpdatedAt
 @Column
 updatedOn! : Date;

 @BelongsTo(() => Cakes, "cake_id")
    public cake : Cakes;

    @BelongsTo(() => Order, "user_id")
    public order : Order;

   }

export interface createFavouriteModel{
    cake_id : string;
    user_id: string
}
