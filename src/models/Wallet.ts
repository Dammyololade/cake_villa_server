import {Column, Table, UpdatedAt, CreatedAt, ForeignKey, Scopes, BelongsTo, Model} from "sequelize-typescript";
import {User} from "./User";


@Table({
    tableName: "wallets",
})

export class Wallet extends Model<Wallet>{
    @ForeignKey(() => User)
    @Column
    public user_id: number;

    @Column
    public balance: number;

    @Column
    public ledger_balance!: number;

    @Column
    public pin!: string;

    @CreatedAt
    @Column
    public created_on!: Date;

    @UpdatedAt
    @Column
    public updated_on!: Date;

    @BelongsTo(() => User, "user_id")
    public user: User;
}


