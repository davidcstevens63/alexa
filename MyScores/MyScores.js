// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
    content: `SessionSpeechlet - ${output}`,
},
    reprompt: {
        outputSpeech: {
            type: 'PlainText',
                text: repromptText,
        },
    },
    shouldEndSession,
};
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// -------------------- Intent Functions ---------------------------------

function getWelcomeResponse(callback){
    const sessionAttributes = {};
    const cardTitle = 'Welcome to your scores'
    const speechOutput = 'Welcome to your scores';
    const repromptText = 'Go ahead, ask away';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// -------------------- EVENT HANDLERS -----------------------------------

function onSessionStarted( sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

function onLaunch( launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    getWelcomeResponse(callback);

}

function onIntent( intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest},sessionId=${session.sessionId}`);


    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'WelcomeToScores') {
        getWelcomMessage(callback);
    }
    else {
        throw new Error('Invalid intent');
    }

}

function onSessionEnded( sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here

}


// --------------------- MAIN HANDLER CALLED BY LAMBDA ---------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = (event, context, callback) => {
    try
    {

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        /**
         if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[amzn1.ask.skill.70979a5d-5c55-4ff3-aa61-1d02ed09b39c]') {
         callback('Invalid Application ID');
         }
         */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
        });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    }
    catch (err)
    {
        callback(err);
    }
}