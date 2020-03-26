
import {Column, Table, Model, CreatedAt, UpdatedAt, DataType} from "sequelize-typescript";


@Table({
   tableName: "cakes",
})

export class Cakes extends Model <Cakes> {

@Column
   public name: string;

   @Column
   public cake_id: string;
    
    @Column
   public size: string;

    @Column
    public price: number;

    @Column(DataType.TEXT)
    public image: string;

    @CreatedAt
    @Column
    public createdOn!: Date;

    @UpdatedAt
    @Column
    public updatedOn!: Date;
    
     }

     export interface CakeCreateModel{
         name: string;
         cake_id: string;
         size: string;
         price: number;
         image: string;
         }

