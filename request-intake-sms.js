// the code below is attached to a Twilio number, and is triggered as a cloud function (stateless! remembers nothing) 
// when an  SMS comes in. It's attached to the number in the Twilio console, and the function is written directly in the Twilio 
// console.  


exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();
  let phone = event.From;
  let request = event.Body;
  let twilioSid = event.SmsSid; //SMS unique ID
  
  console.log("INCOMING from " + phone);
  var Airtable = require('airtable'); // node module, dependency
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: context.AIRTABLE_API_KEY //set in our environment variables
  });

  var base = Airtable.base('AIRTABLE_BASE'); //replace with real base iD! in airtable API docs
  
  let status = "";
 
  base('Requests').select({  //'Requests' here = the name of the Table, Airtable tab within the Base
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
    "Message": request, //'Field/column': content 
    "Phone": phone,
    "Twilio Call Sid": twilioSid,
    "Text or Voice?": "text",
    "Status": status
  }, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.getId()); // each record has a unique Airtable ID
    twiml.message("thank you for reaching out to crown heights mutual aid - a neighbor volunteer will follow up with you as soon as we can. stay safe!");
    callback(null, twiml);
  });

} // end of createRecord


} //end of exports.handler
