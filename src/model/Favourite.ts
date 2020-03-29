import {Column, Model, Table, UpdatedAt, CreatedAt, BelongsTo} from "sequelize-typescript";
import { User } from "./User";

Table({
    tableName: "favourites",
})

export class Favourite extends Model <Favourite> {
 @Column
 cake_id: number;

 @Column
 user_id: number;

 @CreatedAt
 @Column
 created_on! : Date;

 @UpdatedAt
 @Column
 updated_o! : Date;

 
    @BelongsTo(() => User, "user_id")
    public user : User;

   }

export interface FavouriteInterface{
    cake_id : string;
    user_id: number
    }
