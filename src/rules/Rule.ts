import {check} from "express-validator";

export const rules = {
    createregistration: [
    check("fullname").not().isEmpty().withMessage("This field must not be empty"),
    check("email").not().isEmail().isEmpty().withMessage("E-mail field must not be empty and it must be a valid e-mail"),
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
            check("delivery_date").not().isEmpty().withMessage("This field must not be empty"), 
            check("paid").not().isEmpty().withMessage("This field must not be empty").custom((paid, {req}) => {
                return paid > 0;}).withMessage("Kindly put amount paid"),
                ],

                
}