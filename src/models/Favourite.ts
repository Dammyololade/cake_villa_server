import {Column, Model, Table, UpdatedAt, CreatedAt, BelongsTo} from "sequelize-typescript";
import { User } from "./User";
import { Cake } from "./Cake";

@Table({
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
 updated_on! : Date;

   }

export interface FavouriteInterface{
    cake_id : number;
    user_id: number
    }
