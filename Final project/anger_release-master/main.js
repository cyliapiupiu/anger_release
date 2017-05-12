// Serial used from your Arduino board
// TODO: CHANGE THIS TO THE PROPER PATH. YOU CAN FIND IT IN YOUR
// ARDUINO IDE BY GOING TO Tools > Port and find out which
// path is selected.
const DEVICE_PATH = '/dev/cu.usbmodem1411';

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var SerialConnection = function() {
  this.connectionId = -1;
  this.lineBuffer = "";
  this.boundOnReceive = this.onReceive.bind(this);
  this.boundOnReceiveError = this.onReceiveError.bind(this);
  this.onConnect = new chrome.Event();
  this.onReadLine = new chrome.Event();
  this.onError = new chrome.Event();
};

SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
  if (!connectionInfo) {
    log("Connection failed.");
    return;
  }
  this.connectionId = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(this.boundOnReceive);
  chrome.serial.onReceiveError.addListener(this.boundOnReceiveError);
  this.onConnect.dispatch();
};

SerialConnection.prototype.onReceive = function(receiveInfo) {
  if (receiveInfo.connectionId !== this.connectionId) {
    return;
  }

  this.lineBuffer += ab2str(receiveInfo.data);

  var index;
  while ((index = this.lineBuffer.indexOf('\n')) >= 0) {
    var line = this.lineBuffer.substr(0, index + 1);
    this.onReadLine.dispatch(line);
    this.lineBuffer = this.lineBuffer.substr(index + 1);
  }

};

SerialConnection.prototype.onReceiveError = function(errorInfo) {
  if (errorInfo.connectionId === this.connectionId) {
    this.onError.dispatch(errorInfo.error);
  }
};

SerialConnection.prototype.connect = function(path) {
  chrome.serial.connect(path, this.onConnectComplete.bind(this))
};

SerialConnection.prototype.send = function(msg) {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  chrome.serial.send(this.connectionId, str2ab(msg), function() {});
};

SerialConnection.prototype.disconnect = function() {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  chrome.serial.disconnect(this.connectionId, function() {});
};

////////////////////////////////////////////////////////////

var connection = new SerialConnection();
connection.onConnect.addListener(function() {
  console.log('connected to: ' + DEVICE_PATH);
});

connection.onReadLine.addListener(function(line) {
  console.log(line);
  try {
    punchStatus = jQuery.parseJSON(line).punched;
  } catch(err) {}
  if(state == "ready_to_punch") {
    if(punchStatus == "yes") {
      var possible_responses = ["Ouch! Feel better? Keep punching!",
                                "Ouch! punch me as hard as you can.",
                                "Oh. Come on. Harder!",
                                "See the light? Your stress is almost gone!"];
      var choice = Math.floor(Math.random() * possible_responses.length);
      speak(possible_responses[choice]);
      jump();
    } else if(punchStatus == "no") {
        speak("I think you are done punching me");
        jump();
    }
  }
});

connection.connect(DEVICE_PATH);

$("#mic_button").click(function() { startDictation(); });
