import { Column, Table , Model, UpdatedAt, CreatedAt} from "sequelize-typescript";

@Table({
    tableName: "registration",
})

export class Registration extends Model <Registration> {

    @Column
    public fullname: string;

    @Column
    public email: string;

    @Column 
    public phone: string;

    @Column
    public password: string

    @CreatedAt
    @Column
    public createdOn!: Date;

    @UpdatedAt
    @Column
    public updatedOn!: Date;
 
    }

    export interface RegistrationCreateModel{
      fullname: string;
      email: string;
      phone: string;
      password: string
    }

    export interface LoginCreateModel{
      email: string;
      password: string
    }

     export interface ResetpasswordCteateModel{
       email : string;
       newpassword: string;
       retype_password : string
      }