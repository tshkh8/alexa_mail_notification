'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
   'LaunchRequest': function () {
       this.emit('AMAZON.HelpIntent');
   },
   'AMAZON.HelpIntent': function () {
       this.emit(':tell', 'すいません。もう一度お願いします。');
   },
   'AMAZON.CancelIntent': function () {
       this.emit('AMAZON.HelpIntent');
   },
   'AMAZON.StopIntent': function () {
       this.emit('AMAZON.HelpIntent');
   },
   'OmutuKoukan': function() {
       var s = this;
       sendmail('おむつ交換したよ！', function(){
           s.emit(':tell', 'おむつ交換、おつかれさまでした。');
       });
   },
   'Milk': function() {
       var s = this;
       sendmail('ミルクあげたよ！', function(){
           s.emit(':tell', 'ミルク、おつかれさまでした。');
       });
   },
   'Ofuro': function() {
       var s = this;
       sendmail('お風呂入れたよ！', function(){
           s.emit(':tell', 'お風呂、おつかれさまでした。');
       });
   },
};

exports.handler = function (event, context) {
   const alexa = Alexa.handler(event, context);
   alexa.APP_ID = APP_ID;
   // To enable string internationalization (i18n) features, set a resources object.
   alexa.registerHandlers(handlers);
   alexa.execute();
};

function sendmail(message, callback) {
   console.log("メール送信開始");
   const ses = new AWS.SES({region: "us-west-2"});

   const body = message;

   const email = {
       Source: "tshkh8@yahoo.co.jp",
       Destination: { ToAddresses: [process.env.mail_address1, process.env.mail_address2] },
       Message: {
           Body: { Text: { Data: body } },
           Subject: { Data: message },
       },
   };

   ses.sendEmail(email, function(err, data) {
       if (err) {
           console.log(err, err.stack); // an error occurred
       } else {
           console.log(data);           // successful response
           return callback();
       }
   });
   console.log("メール送信終了");
}