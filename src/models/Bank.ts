import {Column, Table, Model, UpdatedAt, CreatedAt} from "sequelize-typescript";

@Table({
    tableName: "banks",
})

export class Bank extends Model <Bank>{
    
    @Column
     name: string;

    @Column
    account_name: string;
    
    @Column
    account_number: string;

    @Column
    logo_url: string;

    @Column
    ussd_code: string;

    @Column
    activated : boolean;

    @UpdatedAt
    @Column
    update_on!: Date;

    @CreatedAt
    @Column
    created_on!: Date;
 
  }

  export interface CreateBankModel{
      name: string;
      account_name: string;
      account_number: string;
      activated :boolean;
      logo_url: string;
      ussd_code: string
  } 

