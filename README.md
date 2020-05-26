# twilio-functions
hotline, for incoming calls + texts to a volunteer request phone number; node.js, Twilio API, Airtable API

each of these .js files correspond with serverless functions written in the Twilio console - where they're also attached to events (when a voice call comes in to the phone number, RUN this function; when an SMS comes into the phone number, RUN that function; etc.)

NOTE: as of 05.25.2020, CHMA uses Twilio Studio to assign request Status + other info based on dialtone input by the user on the call ("if you live in Crown Heights, press 1...") The voicemail mp3's that we use are also hosted as Twilio Assets, but uploaded here as well. 
