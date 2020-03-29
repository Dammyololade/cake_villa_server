import {Column, Table, Model, BelongsTo, CreatedAt, UpdatedAt} from "sequelize-typescript";
import { User } from "./User";

Table({
    tableName: "messages",
})

export class Message extends Model <Message>{
@Column
user_id: number;

@Column
public message: string;

@CreatedAt
created_on! : Date;

@UpdatedAt
updateted_on! : Date

@BelongsTo(() => User, "user_id")
public user: User;

}

export interface MessageInterface {
    user_id: number;
    message: string;
}