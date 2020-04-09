import {BelongsTo, Column, CreatedAt,ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import { User } from "./User";
import { Wallet } from "./Wallet";

@Table({
    tableName: "wallet_fundings",
})
export class WalletFunding extends Model<WalletFunding>{

    @ForeignKey(() => Wallet)
    @Column
    public wallet_id: number;

    @Column
    public user_id: number;

    @Column
    public amount: number;

    @Column
    public sender_name: string;

    @Column
    public type: string;

    @Column
    public bank_paid_to!: string;

    @Column
    public status: string;

    @CreatedAt
    @Column
    public createdOn!: Date;

    @UpdatedAt
    @Column
    public updatedOn!: Date;

    @BelongsTo(() => Wallet, "wallet_id")
    public wallet: Wallet;

    @BelongsTo(() => User, "user_id")
    public user: User;
}

export interface CreateWalletFundingModel {
    wallet_id: number;
    user_id: number;
    amount: number;
    sender_name: string;
    type: string;
    bank_paid_to: string;
    status: string
      }


export enum WalletFundingType {
    Paystack = "paystack",
    Banktransfer = "bank_transfer",
}

export enum WalletFundingStatus {
    Pending = "pending",
    Verified = "verified",
    Declined = "declined",
}


