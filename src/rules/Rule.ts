import {check} from "express-validator";
import {WalletFundingStatus, WalletFundingType } from "../models/WalletFunding";

export const rules = {
    createregistration: [
    check("fullname").not().isEmpty().withMessage("This field must not be empty"),
    check("email").not().isEmpty().withMessage("E-mail field must not be empty and it must be a valid e-mail"),
    check("phone").not().isEmpty().withMessage("This field must not be empty"),
    check("password").not().isEmpty().withMessage("This field must not be empty"),
    ],
    createlogin: [
        check("email").not().isEmpty().withMessage("This field must not be empty"),
        check("password").not().isEmpty().withMessage("This field must not be empty"),
    ],

    createresetpassword: [
        check("email").not().isEmpty().withMessage("This field must not be empty"),
        check("newpassword").not().isEmpty().withMessage("This field must not be empty"),
        check("retype_password").not().isEmpty().withMessage("This field must not be empty"),
    ],

    createcake: [
        check("name").not().isEmpty().withMessage("This field must not be empty"),
        check("size").not().isEmpty().withMessage("This field must not be empty"),  
        check("price").not().isEmpty().withMessage("This field must not be empty"),
        check("image").not().isEmpty().withMessage("This field must not be empty"),
        ],

        createorder: [
            check("user_id").not().isEmpty().withMessage("This field must not be empty"),
            check("cake_id").not().isEmpty().withMessage("This field must not be empty"),  
            check("amount").not().isEmpty().withMessage("This field must not be empty").custom((paid, {req}) => {
                return paid > 0;}).withMessage("Kindly put amount paid"),
                ],

         createfavourite: [
            check("cake_id").not().isEmpty().withMessage("This field must not be empty"),
            check("user_id").not().isEmpty().withMessage("This field must not be empty"),  
                 ],

         createMessage: [
             check("user_id").not().isEmpty().withMessage("This field must not be empty"),
             check("message").not().isEmpty().withMessage("This field must not be empty"),  
                 ],     
                
         changepassword: [
            check("email").not().isEmpty().withMessage("This field must not be empty"),
            check("oldpassword").not().isEmpty().withMessage("This field must not be empty"),
            check("newpassword").not().isEmpty().withMessage("This field must not be empty"), 
            check("confirmpassword").not().isEmpty().withMessage("This field must not be empty"),
                ], 

                creatBank: [
               check("name").not().isEmpty().withMessage("This field must not be empty"),
               check("account_name").not().isEmpty().withMessage("This field must not be empty"),
               check("account_number").not().isEmpty().withMessage("This field must not be empty"),
               check("logo_url").not().isEmpty().withMessage("This field must not be empty"),
               check("ussd_code").not().isEmpty().withMessage("This field must not be empty"),
                ],

               CreateWalletFunding: [
               check("wallet_id").not().isEmpty().withMessage("This field must not be empty"),
               check("user_id").not().isEmpty().withMessage("This field must not be empty"),
               check("amount").custom((amount, { req }) => {
                return amount > 0;}).not().isEmpty().withMessage("Amount must be greater than zero"),
               check("sender_name").not().isEmpty().withMessage("This field must not be empty"),
               check("type").isIn([WalletFundingType.Banktransfer,  WalletFundingType.Paystack])
               .withMessage("Types not found"),
               check("bank_paid_to").custom((bank_paid_to, {req}) => {
               if(req.body.type === WalletFundingType.Banktransfer && !bank_paid_to){
                 return false;
               }
               return true;
               }).withMessage("Payment type of bank transfer is required"),
               check("status").isIn([WalletFundingStatus.Declined, WalletFundingStatus.Pending,  WalletFundingStatus.Verified])
               .withMessage("Status not found"),
               check("reference").custom((reference, {req}) =>{
                if(req.body.type === WalletFundingType.Paystack && !reference){
                    return false;
                }
                return true;
               }).withMessage("Paystack reference is required"),
                  ],
}
