
import { Column, Table , Model, UpdatedAt, CreatedAt, ForeignKey, BelongsTo} from "sequelize-typescript";
import {User} from "../models/User";

@Table({
    tableName: "orders",
})

export class Order extends Model<Order>{

@ForeignKey(() => User)
@Column
user_id: number;

 @Column
 cake_id: number;

 @Column
 status: string;

 @Column
 order_number: string;

 @Column
 paid: boolean;

 @Column
 amount: number;

 @Column
 delivery_date: Date;

 @Column
 created_date: Date;

@CreatedAt
@Column
public created_on!: Date;

@UpdatedAt
@Column
public updated_on!: Date;

//@BelongsTo(() => User, "user_id")
    public user: User;

 }

 export interface OrderInterface {
     user_id: string;
     cake_id: string;
     status : string;
     paid: boolean;
     amount: number;
     order_number: string;
     }

 export enum OrderStatus {
    Pending = "pending",
    Processing = "processing",
    Completed = "completed",
     Declined = "declined",
 }