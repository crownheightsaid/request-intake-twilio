// this Twilio serverless function (stateless! remembers nothing) is triggered when an incoming voice call goes to our Twilio number. 
// it plays the initial audio message for a neighbor making a request, and then it records the audio response from the call
// and it calls our next Twilio function after the recording is done 

'use strict';

exports.handler = function(context, event, callback) {
 
 let response = new Twilio.twiml.VoiceResponse();

 let audio_url = ""; //fill in with audio file when we have it! multilingual

 response.say( //robot voice as a placeholder
   { voice: 'woman', language: 'en-US' },
   'Thank you for reaching out to Crown Heights Mutual Aid. Please tell us your needs, and then a neighbor volunteer will be in touch with you soon. Stay safe!'
 ); 
 
//for when we have audio file:
// response.play(audio_url);

 response.record({
   action: '/voicemail-recording',  //calls our next function, getting the voicemail recording and data to Airtable
   timeout: '5'  //if call quiet for 5 seconds, runs the above function
 });

 callback(null, response);
 
}; //end exports.handler
