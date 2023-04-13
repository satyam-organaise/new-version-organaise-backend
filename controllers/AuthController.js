'use strict';
import {
    signUp,
    verify,
    signIn,
    resendVerificationMail,
    sendOtpForForPass,
    forgetCngPass,
    CheckEmailAvailabeOrNot
} from '../cognito-services/index.js';
import dotenv from "dotenv";
import { registerUser, authUser, allUsers } from "./newUserController.js";
import { protect } from '../middleware/authMiddleWare.js';

dotenv.config();

async function SignUpFun(req, res) {
    const response = await signUp(
        req.body.email,
        req.body.password,
        req.body.given_name,
        req.body.family_name
    );
    if (response.status) {
        res.json(response);
    } else {
        res.json(response);
    }

}

async function VerifyFun(req, res) {
    const response = await verify(req.body.email, req.body.codeEmailVerify);
    if (response.status) {
        if (req.body.serviceType === "createAccount") {
            await registerUser(req, res);/// Register the user
        } else if(req.body.serviceType === "loginVerification") {
            await authUser(req, res);/// Login the user afer verify otp
        }

    } else {
        res.json(response);
    }
}

async function SignInFun(req, res) {
    const response = await signIn(req.body.email, req.body.password);
    if (response.status) {
        await authUser(req, res);////account verifyed already so login the user
    } else {
        res.json(response)
    }
}

async function resendVerificationMailFun(req, res) {
    const response = await resendVerificationMail(req.body.email);
    res.json(response)
}

async function sendOtpForgetPassFun(req, res) {
    const response = await sendOtpForForPass(req.body.email);
    res.json(response)
}

async function CngForgetPassFun(req, res) {
    const response = await forgetCngPass(req.body.email, req.body.otp, req.body.password);
    res.json(response);
}

/////// Here we are check email is available in user pool or not
async function checkEmailAvailability (req,res){
    const response = await CheckEmailAvailabeOrNot(req.body.email);
    res.json(response);
}

async function searchUserInDB (req,res){
    const response = await allUsers(req,res);
    res.json(response);
}




export {
    SignInFun,
    VerifyFun,
    SignUpFun,
    resendVerificationMailFun,
    sendOtpForgetPassFun,
    CngForgetPassFun,
    checkEmailAvailability,
    searchUserInDB

}
