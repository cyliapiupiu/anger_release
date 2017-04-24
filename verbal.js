/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

var u = new SpeechSynthesisUtterance();
u.lang = 'en-US';
u.volume = 1.0; 
u.pitch = 1.75;
u.rate = 1.0;
u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google UK English Male"; })[0];

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    setEyeColor(listeningEyeColor);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      setEyeColor(normalEyeColor);

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
      setEyeColor(curEyeColor);
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    user_said = user_said.toLowerCase();
    if (user_said. toLowerCase().includes("hi") ||
        user_said. toLowerCase().includes("hey") ||
        user_said. toLowerCase().includes("hello") ||
        user_said. toLowerCase().includes("what's up")) {
      response = "hi, I am Soft Vilius. How do you feel today?";
      state = "before_emotion";
    } else if(is_happy_mood(user_said)) {
      response = "That's great! Nice to hear!";
      state = "initial";     
    } else if (is_neutral_mood(user_said)){
      response ="oh,do you feel any stress?"; 
      state = "neutral_reponse_waiting";
    } else if (user_said.toLowerCase().includes("yes") && state == "neutral_reponse_waiting" ) {
      response ="tell me what's wrong. i can help you relax.";
      state = "after_emotion";
    } else if (user_said.toLowerCase().includes("no") && state == "neutral_reponse_waiting") {
      response = "good to know, hope you have a nice day.";
      state = "initial";
    } else if (state == "after_emotion" || state == "angry_mood_waiting"){
      response = "thank you for letting me know. feel free to punch me to relieve your stress.";
      state = "ready_to_punch";
    } else if (is_angry_mood(user_said)){
      response = "what's wrong? tell me and i can help you relieve your stress.";
      state = "angry_mood_waiting";
    } else if (user_said.toLowerCase().includes("bye") && state == "ready_to_punch"){
      response = "congratulations. i hope this punching exercise worked. don't forget to exercise to relieve your stress. i wish you a great day! bye!";
      state = "initial";
    } else if(user_said.toLowerCase().includes("bye")){
      response = "ok have a nice day!";
      state = "initial";
    } else {
      response = "I didn't understand that";
    }

    return response;
}


function is_happy_mood(user_said) {
  var happy_moods = ["happy", "cool", "joyful", "nice day", "awesome"];
  for(i = 0; i < happy_moods.length; i++) {
    if(user_said.toLowerCase().includes(happy_moods[i])) {
      return true;
    }
  }
  return false;
}

function is_neutral_mood(user_said){
  var neutral_mood =["peaceful", "calm", "ok", "neutral", "normal", "well", "good"];
  for(i = 0; i < neutral_mood.length; i++) {
    if(user_said.toLowerCase().includes(neutral_mood[i])) {
      return true;
    }
  }
  return false
}

function is_angry_mood(user_said) {
  var angry_mood=["angry","bad","sad","angry",
                    "upset","irritable","annoyed",
                    "offended", "bitter","emotionally",
                    "painful","impassioned","mad","unacceptablely",
                    "depressed","overwhelming","burned out", 
                    "unsatisfy", "crying", "hate"];
  for( i = 0; i < angry_mood.length; i ++) {
    if (user_said.toLowerCase(). includes(angry_mood[i])) {
      return true;
    }
  }
  return false
}


/* 
 *speak out some text 
 */
function speak(text, callback) {

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 1.0; 
  u.pitch = 1.6;
  u.rate = 1.0;
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google UK English Male"; })[0];

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
