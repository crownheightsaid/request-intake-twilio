// the code below is attached to a Twilio number, and is triggered as a cloud function (stateless! remembers nothing) 
// when an  SMS comes in. It's attached to the number in the Twilio console, and the function is written directly in the Twilio 
// console.  


exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();
  let phone = event.From;
  let request = event.Body;
  
  console.log("INCOMING from " + phone);
  var Airtable = require('airtable'); // node module, dependency
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: context.AIRTABLE_API_KEY //set in our environment variables
  });

  var base = Airtable.base('AIRTABLE_BASE_ID'); //replace with our real base! in airtable API docs
  createRecord();
  
  
function createRecord() {
  console.log("creating record");
  base('Requests').create({ // creates a record (row) in Airtable base
    "Message": request, // 'Field/column': content 
    "Phone": phone,
    "Text or Voice?": "text"
  }, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.getId()); // each record has a unique Airtable ID
    twiml.message("thank you for reaching out to crown heights mutual aid - a neighbor volunteer will follow up with you soon. stay safe!");
    callback(null, twiml);
  });

} // end of createRecord


} //end of exports.handler
