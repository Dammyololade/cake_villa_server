
import { Column, Table , Model, UpdatedAt, CreatedAt} from "sequelize-typescript";

@Table({
    tableName: "order",
})

export class Order extends Model<Order>{
 @Column
 user_id: string;

 @Column
 cake_id: string;

 @Column
 status: string;

 @Column
 paid: boolean;

 @Column
 delivery_date: Date;

 @Column
 created_date: Date;

@CreatedAt
@Column
public createdOn!: Date;

@UpdatedAt
@Column
public updatedOn!: Date; 
 }

 export interface orderCreateModel{
     user_id: string;
     cake_id: string;
     status : string;
     paid: number;
     order_number: string;
     delivery_date: Date;
     created_date: Date;
 }

 export enum OrderStatus {
    Pending = "pending",
    Processing = "processing",
    Completed = "completed",
    Declined = "declined",
 }