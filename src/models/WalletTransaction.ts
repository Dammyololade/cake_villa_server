import {Column, Table, Model, UpdatedAt ,CreatedAt, ForeignKey} from "sequelize-typescript";
import {Wallet} from "./Wallet";

@Table({
    tableName: "wallet_transactions",
})

export class WalletTransaction extends Model<WalletTransaction>{
    @ForeignKey(() => Wallet)
    @Column
    wallet_id :number;

    @Column
    transaction_amount : number;

    @Column
    transaction_type : string;

    @Column
    transacted_by : string;

    @Column
    note: string;

    @CreatedAt
    @Column
    created_on!: Date;

    @UpdatedAt
    @Column
    updated_on!: Date;

    }

    export interface createWalletTransction{
        wallet_id: number;
        transacton_amount : number;
        transaction_type : string;
        transacted_by: string;
        note: string;
    }

    export enum WalletTransactionsType{
        Debit = "debit",
        Credit = "credit"
        }
