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

 var base = Airtable.base('AIRTABLE_BASE');  //replace with real Airtable base from API documentation
 
 let status = "";
 
 console.log("now looking at Airtable...");
  base('Requests').select({ //'Requests' here = the name of the Table, Airtable tab
    maxRecords: 1, //querying to see if incoming phone already exists at least once in the Airtable base
    fields: ["Phone"],
    filterByFormula: "({Phone} = '" + phone + "')"
}).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    if (records.length === 0) { //if no records matching incoming phone number
      status = "Dispatch Needed";
      createRecord();
    } else { //else, if at least 1 record matches the incoming phone number, mark as Duplicate 
      records.forEach(function(record) {
        console.log('Duplicate', record.id);
        status = "Duplicate";
        createRecord();
      });
    }
});
 
 
 function createRecord() {
  console.log("creating record");
  base('Requests').create({ // creates a record (row) in Airtable base
    "Message": recordingUrl, // 'Field/column': content 
    "Phone": phone,
    "Text or Voice?": "voice",
    "Twilio Call Sid": twilioSid,
    "Status": status,
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
