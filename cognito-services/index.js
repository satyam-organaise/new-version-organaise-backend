import AWS from 'aws-sdk';
import {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
}
  from '../helpers/AwsConfig.js';
import dotenv from "dotenv";
import User from '../model/userModel.js';
dotenv.config();

function signUp(email, password, given_name, family_name, agent = 'none') {
  return new Promise((resolve) => {
    initAWS();
    setCognitoAttributeList(email, given_name, family_name, agent);
    getUserPool().signUp(email, password, getCognitoAttributeList(), null, function (err, result) {
      if (err) {
        return resolve({ statusCode: 422, response: err, status: false });
      }
      const response = {
        username: result.user.username,
        userConfirmed: result.userConfirmed,
        userAgent: result.user.client.userAgent,
      }
      return resolve({ statusCode: 201, response: response, status: true });
    });
  });
}

function verify(email, code) {
  return new Promise((resolve) => {
    getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
      if (err) {
        return resolve({ statusCode: 422, response: err, status: false });
      }
      return resolve({ statusCode: 200, response: result, status: true });
    });
  });
}

function signIn(email, password) {
  return new Promise((resolve) => {
    getCognitoUser(email).authenticateUser(getAuthDetails(email, password), {
      onSuccess: (result) => {
        const token = {
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        }
        return resolve({
          statusCode: 200,
          response: decodeJWTToken(token),
          status: true
        });
      },

      onFailure: (err) => {
        return resolve({
          statusCode: 400,
          response: err.message || JSON.stringify(err),
          status: false
        });
      },
    });
  });
}

function resendVerificationMail(email) {
  return new Promise((resolve) => {
    getCognitoUser(email).resendConfirmationCode(function (err, result) {
      if (err) {
        return resolve({
          statusCode: 400,
          response: err.message || JSON.stringify(err), status: false
        });
      }
      return resolve({ statusCode: 200, response: result, status: true });
    })
  });
}


///////// Forget password send the otp for changing the password
const sendOtpForForPass = async (email) => {
  return new Promise((resolve) => {
    getCognitoUser(email).forgotPassword({
      onSuccess: function (result) {
        return resolve({ statusCode: 200, response: result, status: true });
      },
      onFailure: function (err) {
        return resolve({ statusCode: 400, response: err.message || JSON.stringify(err), status: false });
      },
    });
  })
}

///////update password in mondodb 
const updatePassWordInMongoDB = async (email, newPassword) => {
  const user = await User.findOne({ email });
  const runSavePassCmd = await user.updatePassword(newPassword);
}

const forgetCngPass = async (email, verificationCode, newPassword) => {
  return new Promise((resolve) => {
    getCognitoUser(email).confirmPassword(verificationCode, newPassword, {
      onSuccess: function (result) {
        updatePassWordInMongoDB(email, newPassword);
        return resolve({ statusCode: 200, response: result, status: true });
      },
      onFailure: function (err) {
        return resolve({
          statusCode: 400,
          response: err.message || JSON.stringify(err),
          status: false
        });
      },
    });
  })
}

///////// Check email is available in user Pool or not
///////// Forget password send the otp for changing the password
const CheckEmailAvailabeOrNot = async (email) => {
  try {
    const response = await User.findOne({ email });
    if (response) {
      return { statusCode: 200, message: "OK", status: true }
    } else {
      return { statusCode: 404, message: "Email not available", status: false }
    }
  } catch (error) {
    return {
      message: "Something is wrong please try again",
      status: false,
      statusCode: 400
    }
  }

}


export {
  signUp,
  verify,
  signIn,
  resendVerificationMail,
  sendOtpForForPass,
  forgetCngPass,
  CheckEmailAvailabeOrNot
}