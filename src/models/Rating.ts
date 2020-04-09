import { Column, Table , Model, UpdatedAt, CreatedAt, BelongsTo} from "sequelize-typescript";

@Table({
    tableName: "ratings",
})

export class Rating extends Model<Rating>{
 @Column
 user_id: number;

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
public created_on!: Date;

@UpdatedAt
@Column
public updated_on!: Date; 

 }