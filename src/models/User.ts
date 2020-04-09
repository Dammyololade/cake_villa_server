import { Column, Table , Model, UpdatedAt, CreatedAt,Default, HasOne, AllowNull} from "sequelize-typescript";
import {Wallet} from "./Wallet";

@Table({
    tableName: "users",
})

export class User extends Model <User> {

    @Column
    public fullname: string;

    @Column
    public email: string;

    @Column 
    public phone: string;

    @Column
    public admin: boolean;

    @Column
    public password: string

    @AllowNull(false)
    @Default("")
    @Column
    public push_token: string;

    @CreatedAt
    @Column
    public created_on!: Date;

    @UpdatedAt
    @Column
    public updated_on!: Date;

    @HasOne(() => Wallet, "user_id")
    public wallet?: Wallet;
 
    }

    export interface UserInterface{
      fullname: string;
      email: string;
      phone: string;
      admin: boolean;
      password: string;
      push_token: string
    }

    export interface LoginInterface{
      email: string;
      password: string
    }

     export interface ResetPasswordInterface{
       email : string;
       newpassword: string;
       retype_password : string
      }

      export  interface ChangePasswordInterface{
        email: string;
        oldpassword: string;
        newpassword: string;
        confirmpassword: string
      }