/********************************
*********************************
*   @Author Dancan Kimani
*   Lipa Na Mpesa Online STK PUSH
*********************************
*********************************/
var request = require('request');
var moment = require('moment');
var base64 = require('base-64');
var consumer_key = "FcgWrI6Ku2W16OHpCwNoqj9mQAmEAxkq"; //copy this from your app(https://developer.safaricom.co.ke/user/me/apps)
var consumer_secret = "xwcM7HEQ9Ywl2aVU"; //copy this from your app(https://developer.safaricom.co.ke/user/me/apps)

var url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; //change this after going live
var auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

var url_for_api = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; //change this after going live
var phoneNumber = "254724088765"; //the phone number in which to send the stk push
var shortCode = "174379"; //this is the testing shortcode change it to your own after going live
var passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";  //change this after going live
var amount = "5";
var callBackURL = "https://ngara.co.ke/callback"; //your callback url for which to pick thwe json data returned
var accountReference = "W32SDF324SD"; //any specific reference
var transactionDesc = "Small description";
let timestamp = moment().format('YYYYMMDDHHmmss');
let password;

function getToken(tokenParam){
  var oauth_token;
  request({url : url,headers : {"Authorization" : auth}},function (error, response, body) {
    var oauth_body = JSON.parse(body);
    oauth_token = oauth_body.access_token;
    tokenParam(oauth_token);
    }
  );
}

getToken(function(token) {

  var oauth_token = token;

  var auth_for_api = "Bearer " + oauth_token;

  password = base64.encode(shortCode+passkey+timestamp);

  request(
    {
      method: 'POST',
      url : url_for_api,
      headers : {
        "Authorization" : auth_for_api
      },
    json : {
      "BusinessShortCode": shortCode,
      "Password": password,
      "Timestamp": timestamp,
      "TransactionType": "CustomerPayBillOnline", //this can change depending on paybill or till number
      "Amount": amount,
      "PartyA": phoneNumber,
      "PartyB": shortCode,
      "PhoneNumber": phoneNumber,
      "CallBackURL": callBackURL,
      "AccountReference": accountReference,
      "TransactionDesc": transactionDesc
    }
  },
    function (error, response, body) {
        console.log(body);
    }
  )
});





