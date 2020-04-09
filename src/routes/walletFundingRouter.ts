import * as express from "express";
import * as sentry from "@sentry/node";
import {Response}   from "../helper/Response";
import {rules} from "../rules/Rule";
import {NotificationDirector} from "../helper/NotificationDirector";
import {Wallet} from "../models/Wallet";
import { validationResult } from "express-validator";import {WalletFundingStatus, WalletFundingType, WalletFunding, CreateWalletFundingModel} from "../models/WalletFunding";
import {WalletService} from "../rules/WalletService";
import {User} from "../models/User";

const response = new Response();
const notificationDirector = new NotificationDirector();
const walletservice = new WalletService();
export const walletFundingRouter = express.Router();

walletFundingRouter.post("/", async (req: express.Request, res: express.Response) => {
    const error = validationResult(req);
    if(error.isEmpty()){
        return res.status(422).json(
            response.error({error: error.array()}, "Invalid entrys")
        )
    }
    
    const payload = req.body as CreateWalletFundingModel
    payload.status = WalletFundingStatus.Pending;
    try {
    const fund = await WalletFunding.create(payload);
    const user = await User.findByPk(payload.user_id);
             let adminMsg = "";
             let userMsg = "";
            adminMsg = `${user.fullname} has paid ${fund.amount} naira via bank transfer`;
            userMsg = `Thanks for reaching out to us, we will verify your payment soon, you will be notified as soon as we confirm your payment`;
        
        notificationDirector.setToken(user.push_token)
            .setNotification("Wallet Funding", userMsg)
            .send();
        notificationDirector.setTopic(NotificationDirector.ADMIN_TOPIC)
            .setNotification("Wallet Funding", adminMsg)
                .sendToTopic();
        return res.json(response.success(fund));
   /* if(payload.type === WalletFundingType.Paystack){
          if (fund.type !== WalletFundingType.Paystack) {
                return;
            }
            const verifed = await walletService.verifyPaystackTransaction(fund.reference);
            if (!verifed) {
                return  WalletFundingStatus.Declined;
            }
            const note = "Paystack Deposit";
            await walletService.updateStatus(fund, WalletFundingStatus.Verified);
            await walletService.creditWallet(
                fund.wallet_id, fund.amount, note, "paystack");
            return await fund.reload({include: [Wallet]});
                   }
        
          User.findByPk(payload.user_id).then((user) => {
        let adminMsg = "";
        let userMsg = "";
        if (payload.type === WalletFundingType.Paystack) {
            if ( fund.status ===  WalletFundingStatus.Verified) {
                adminMsg = `${user.fullname} has paid ${fund.amount} naira via Paystack`;
                userMsg = `${fund.amount} naira has been credited to your wallet`;
            } else {
                adminMsg = `${user.fullname} was unable to fund wallet via paystack`;
                userMsg = `We are very sorry you couldnt complete your payment, kindly try bank transfer option`;
            }
        } 
             const user = await User.findByPk(payload.user_id);
             let adminMsg = "";
             let userMsg = "";
            adminMsg = `${user.fullname} has paid ${fund.amount} naira via bank transfer`;
            userMsg = `Thanks for reaching out to us, we will verify your payment soon, you will be notified as soon as we confirm your payment`;
        
        notificationDirector.setToken(user.push_token)
            .setNotification("Wallet Funding", userMsg)
            .send();
        notificationDirector.setTopic(NotificationDirector.ADMIN_TOPIC)
            .setNotification("Wallet Funding", adminMsg)
                .sendToTopic();
        return res.json(response.success(fund));*/
        
        }
         catch(err) {
        sentry.captureException(err);
       console.error("oops an error occured", err);
       return res.status(400).json(response.error({error: err}, err));
        }
        
       });


       walletFundingRouter.put("/:id", async (req: express.Request, res: express.Response) =>{
           try{
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(422).json(
                    response.error({error: error.array()}, "Invalid entrys")
                )  
            }
            let fund = await WalletFunding.findByPk(req.params.id);
             if(!fund || fund.type === WalletFundingType.Banktransfer ){
                return res.status(400).json(response.error(null,
                    "sorry you can not change the status of this payment funding"));
              }
              
               fund = await walletservice.handleBankTransferFunds(fund, req.body.status, req.body.note);
             fund = await fund.reload({include: [Wallet, User]});
            let adminMsg = "";
            let userMsg = "";
            if (fund.status === WalletFundingStatus.Declined) {
                adminMsg = `${fund.user.fullname}'s wallet funding of ${fund.amount} naira has been declined`;
                userMsg = `Your payment has been been declined, kindly contact support for more enquiries`;
            } else {
                adminMsg = `${fund.user.fullname} ${fund.user.fullname}'s wallet has been funded with the amount of ${fund.amount} naira`;
                userMsg = `${fund.amount} has been credited to your wallet`;
            }
            
            notificationDirector.setToken(fund.user.push_token)
                .setNotification("Wallet Funding", userMsg)
                .send();
            notificationDirector.setTopic(NotificationDirector.ADMIN_TOPIC)
                .setNotification("Wallet Funding", adminMsg)
                    .sendToTopic();
            return res.json(response.success({fund}));
        } catch (err) {
            sentry.captureException(err);
            console.error("oops an error occured", err);
            return res.status(400).json(response.error({error: err}, err));
        }

               });
