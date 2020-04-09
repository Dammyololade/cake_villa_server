
import {Column, Table, Model, CreatedAt, UpdatedAt, DataType} from "sequelize-typescript";


@Table({
   tableName: "cakes",
})

export class Cake extends Model <Cake> {

@Column
   public name: string;
    
    @Column
   public size: string;

    @Column
    public price: number;

    @Column(DataType.TEXT)
    public image: string;

    @CreatedAt
    @Column
    public created_on!: Date;

    @UpdatedAt
    @Column
    public updated_on!: Date;
    
     }

     export interface CakeInterface{
         name: string;
         size: string;
         price: number;
         image: string;
         }

