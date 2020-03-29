import { Column, Table , Model, UpdatedAt, CreatedAt,Default, AllowNull} from "sequelize-typescript";

@Table({
    tableName: "users",
})

export class User extends Model <User> {

    @Column
    public fullname: string;

    @Column
    public email: string;

    @Column
    public user_id: number;

    @Column 
    public phone: string;

    @Column
    public password: string

    @AllowNull(false)
    @Default("")
    @Column
    public push_token: string;

    @CreatedAt
    @Column
    public createdOn!: Date;

    @UpdatedAt
    @Column
    public updatedOn!: Date;
 
    }

    export interface UserInterface{
      fullname: string;
      email: string;
      phone: string;
    
      password: string;
      push_token: string
    }

    export interface LoginInterface{
      email: string;
      password: string
    }

     export interface ResetpasswordInterface{
       email : string;
       newpassword: string;
       retype_password : string
      }