import request from "request-promise";
import { Transaction, where } from "sequelize/types";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { CreateWalletFundingModel, WalletFunding,
   WalletFundingStatus, WalletFundingType } from "../models/WalletFunding";
import { WalletTransaction , WalletTransactionsType} from "../models/WalletTransaction";

export class WalletService {

    //private paystackVerificationurl = "https://api.paystack.co/transaction/verify/";
    

    public async fundWallet(model: CreateWalletFundingModel): Promise<WalletFunding> {
      try {
       let walletFunding = await this.createWalletFunding(model);
           /*if (walletFunding.type === WalletFundingType.Paystack) {
                walletFunding = await this.handlePaystackFunds(walletFunding, model.reference);
            }*/ 
           return walletFunding; 
        } catch (error) {
            console.error("error while creating payment", error);
        }
    }

    public async createWalletFunding(model: CreateWalletFundingModel): Promise<WalletFunding> {
        try {
            model.status = WalletFundingStatus.Pending;
            const fund = await WalletFunding.create(model);
            return fund;
        } catch (err) {
            console.error("error while initializing wallet funding", err);
        }
    }

    /*public async verifyPaystackTransaction(reference: string): Promise<boolean> {
        try {
            const url = this.paystackVerificationurl + reference;
                // const secretKey = process.env.PAYSTACK_SECRET_KEY;
            const pResponse = await request.get(url,
                {headers: {Authorization : "Bearer " + secretKey}, json: true}) 
                .then( (body) => {
                    console.log("the paystack response in json", body);
                    
                    const pay = body;
                    console.log("before returning pasystack response", pay);
                    return pay;
                });
            return pResponse.status;
        } catch (error) {
            console.error("error while verifying payment", error);
        }
    } */

    public async updateStatus(wf: WalletFunding, newStatus: string): Promise<WalletFunding> {
        const update = await wf.update({status : newStatus});
        return update;
    }

    public async handleBankTransferFunds(fund: WalletFunding, status: string,
       transactionNote: string): Promise<WalletFunding> {
        try {
            fund = await this.updateStatus(fund, status);
            if (fund.status !== WalletFundingStatus.Verified) {
                return fund;
            }
            
            await this.creditWallet(
                fund.wallet_id, fund.amount, transactionNote, "admin");
            return await fund.reload({include: [Wallet, User]});
        } catch (error) {
            console.error("error while creating payment", error);
        }
    }

   /*private async handlePaystackFunds(fund: Walletfunding, reference: string): Promise<Walletfunding> {
        try {
            if (fund.type !== WalletFundingType.Paystack) {
                return;
            }
            const verifed = await this.verifyPaystackTransaction(reference);
            if (!verifed) {
                return await this.updateStatus(fund, WalletFundingStatus.Declined);
            }
            const note = "Paystack Deposit";
            await this.updateStatus(fund, WalletFundingStatus.Verified);
            await this.creditWallet(
                fund.wallet_id, fund.amount, note, "paystack");
            return await fund.reload({include: [Wallet]});
        } catch (error) {
            console.error("error while creating payment", error);
        }
    }
    */
    public async creditWallet(walletId: number, amount: number,
        transactionNote: string, transactedBy: string): Promise<Wallet> {
    try {
     let wallet = await Wallet.findByPk(walletId);
    if (!wallet) { return; }
     wallet.balance += amount;
     wallet.ledger_balance += amount;
     wallet = await wallet.save();
      await this.createWalletTransaction(walletId, amount, transactionNote, transactedBy);
     return wallet;
    } catch (err) {
    console.error("error occured", err);
          }
     }

     public async debitWallet(walletId: number, amount: number, transactionNote: string, debitLedger: boolean,
    ): Promise<Wallet> {
        try {
      let wallet = await Wallet.findByPk(walletId);
    wallet.balance -= amount;
        if (debitLedger) {
    wallet.ledger_balance -= amount;
      }
        wallet = await wallet.save();
      await WalletTransaction.create({
            wallet_id : walletId,
        transaction_amount: amount,
     transaction_type: WalletTransactionsType.Debit,
            note: transactionNote,
        transacted_by: "System",
        });
            return wallet;
   } catch (err) {
console.error("Could not debit wallet", err);
   }
    }

private async createWalletTransaction(walletId: number, amount: number,
       transactionNote: string, transactedBy: string): Promise<WalletTransaction> {
     try {
       const walletTransaction = await WalletTransaction.create({
     wallet_id : walletId,
     transaction_amount: amount,
      transaction_type: WalletTransactionsType.Credit,
     note: transactionNote,
     transacted_by: transactedBy,
        });
    return walletTransaction;
        } catch (err) {
    console.error("error occured", err);
        }
}
}
