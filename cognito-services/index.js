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
        return resolve({ statusCode: 200, response: decodeJWTToken(token), status: true });
      },

      onFailure: (err) => {
        return resolve({ statusCode: 400, response: err.message || JSON.stringify(err), status: false });
      },
    });
  });
}

function resendVerificationMail(email) {
  return new Promise((resolve) => {
    getCognitoUser(email).resendConfirmationCode(function (err, result) {
      if (err) {
        return resolve({ statusCode: 400, response: err.message || JSON.stringify(err) });
      }
      return resolve({ statusCode: 200, response: result });
    })
  });
}


///////// Forget password send the otp for changing the password
const sendOtpForForPass = async (email) => {
  return new Promise((resolve) => {
    getCognitoUser(email).forgotPassword({
      onSuccess: function (result) {
        return resolve({ statusCode: 200, response: result });
      },
      onFailure: function (err) {
        return resolve({ statusCode: 400, response: err.message || JSON.stringify(err) });
      },
    });
  })
}

const forgetCngPass = async (email, verificationCode, newPassword) => {
  return new Promise((resolve) => {
    getCognitoUser(email).confirmPassword(verificationCode, newPassword, {
      onSuccess: function (result) {
        return resolve({ statusCode: 200, response: result });
      },
      onFailure: function (err) {
        return resolve({ statusCode: 400, response: err.message || JSON.stringify(err) });
      },
    });
  })
}

///////// Check email is available in user Pool or not
///////// Forget password send the otp for changing the password
const CheckEmailAvailabeOrNot = async (email) => {
  return new Promise((resolve) => {
    initAWS();
    getCognitoUser(email).
      getUserData((err, data) => {
        if (err) {
          resolve({ statusCode: 201, response: err, status: false });
        } else {
          resolve({ statusCode: 201, response: data, status: true });
        }
      });
  })

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