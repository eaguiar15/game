var wsUri = "wss://socketsbay.com/wss/v2/5/5ce2f24dbca97556bfde0cc50bff65ea/";
var log;

function initSocket(){
  websocket = new WebSocket(wsUri);
  websocket.onopen    = function(evt) { onOpen(evt)    };
  websocket.onclose   = function(evt) { onClose(evt)   };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror   = function(evt) { onError(evt)   };
}


function onOpen(evt){
    writeLog("CONNECTED");
  
}

function onClose(evt){
  writeLog("Websocket DISCONNECTED");
}

function onMessage(evt){
    writeLog('RESPONSE: ' + evt.data);
    try{
        let resp = JSON.parse(evt.data);
        switch (resp.action) {
            case "Enter":
                game = resp.game;
                showGame();
                break;
        
            default:
                break;
        }
    }catch(e){
        
    }
}

function onError(evt){
  writeLog('ERROR:' + evt.data);
}

var cont_msg = 0;
function sendMessage(message){
  writeLog("SENT " + (++cont_msg) + ": " + message);
  websocket.send(message);
}

function writeLog(message){
    console.log(message);
}

window.addEventListener("load", initSocket, false);

