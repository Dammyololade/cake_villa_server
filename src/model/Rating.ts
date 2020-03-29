import {Table, Column, UpdatedAt, CreatedAt, Model} from "sequelize-typescript"; 

Table({
    tableName: "ratings",
    })

    export class Rating extends Model <Rating>{

        @Column
        user_id: number;

        @Column
        message: string;

        @Column
        ola:string
        
    }