
import express from "express";
import {
    SignInFun,
    VerifyFun,
    SignUpFun,
    resendVerificationMailFun,
    sendOtpForgetPassFun,
    CngForgetPassFun,
    checkEmailAvailability
} from '../controllers/AuthController.js';
import { tokenVerification } from "../middleware/authMiddleWare.js";

const router = express.Router();


router.post('/signup', SignUpFun);////for signup or create account
router.post('/signin', SignInFun);////for signin or login
router.post('/verify', VerifyFun);////for verify or verify the otp when user create the account 

router.post('/resendVeriCode', resendVerificationMailFun);//// resend verification code
router.post('/sendOtpForgetPassword', sendOtpForgetPassFun);//// send otp when user forget the password
router.post("/forgetPasswordChange", CngForgetPassFun);//// chnage password wwith otp


router.post("/emailCheck", checkEmailAvailability);

router.get("/tokenVerification",tokenVerification);/////check login token is expire or not


export default router;