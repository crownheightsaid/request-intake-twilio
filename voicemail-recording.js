// this Twilio serverless function (stateless! remembers nothing) is triggered after a neighbor request voice call is finished
// it sends the Twilio Call Sid, the URL of the audio recording, and the request phone number to Airtable.
// The function is attached to the number in the Twilio console, and the function is written directly in the Twilio console.  

'use strict';

exports.handler = function(context, event, callback) {
 console.log(event.CallSid, event.RecordingUrl);
 
 let twilioSid = event.CallSid;
 let recordingUrl = event.RecordingUrl;
 let phone = event.From;
 
 var Airtable = require('airtable'); // node module, dependency
 Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: context.AIRTABLE_API_KEY //set in our environment variables
 });

 var base = Airtable.base('apppK7mrvMPcwtv6d'); 
 
 createRecord();
 
 function createRecord() {
  console.log("creating record");
  base('Requests').create({ // creates a record (row) in Airtable base
    "Message": recordingUrl, // 'Field/column': content 
    "Phone": phone,
    "Text or Voice?": "voice",
    "Twilio Call Sid": twilioSid,
    "Status": "Intake Needed"
  }, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.getId()); // each record has a unique Airtable ID
    const response = new Twilio.twiml.VoiceResponse();
        response.say({ voice: 'woman', language: 'en-US' }, 'Thank you. You will hear from a neighbor soon.');
        callback(null, response);
  });

} // end of createRecord

 
}; // end of exports.handler
