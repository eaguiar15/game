var wsUri = "wss://socketsbay.com/wss/v2/5/5ce2f24dbca97556bfde0cc50bff65ea/";
//var wsUri = "wss://socketsbay.com/wss/v2/1/demo/";
// https://piehost.com/pricing
//var wsUri = "wss://free.blr2.piesocket.com/v3/1?api_key=bvOiuR0Adlo6o6tEAvzZlSc9Ln4ejVsqDBnqUzl4&notify_self=0";
var log;

function initSocket(){
  console.log("try connect...");
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

        if(resp.idGame == player.idGame){
            switch (resp.action) {
                case "Enter":
                    game = resp.game;
                    showGame();
                    break;
                case "dealCards":
                      game = resp.game;
                      dealCards();
                      showGame();
                      break;
                case "showGame":
                  game = resp.game;
                  playset = resp.playset;
                  showGame();
                  break;
                case "getGame":
                  sendMessage(JSON.stringify({
                      action : "setGame",
                      idGame : game.idGame,
                      game   : game
                  }));
                    break;
                case "setGame"  :
                    game = resp.game;
                    init();
                    dealCards();
                    showGame();
                    break;
                default:
                    break;
            }
         }
         
    }catch(e){

    }

    try{
        let resp = JSON.parse(evt.data);
        switch (resp.action) {
            case "notification":
                setNotification(resp.from,resp.message);
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

/*window.addEventListener('beforeunload', function (event) {
    var mensagem = 'Ao sair seu jogo sera encerrado?';
    event.returnValue = mensagem;
  return mensagem;
});*/

function sendNotification(pElem){
    if(typeof player === 'undefined'){
        setNotification('Visitante',pElem.value);
        sendMessage(JSON.stringify({
            action : "notification",
            from   :  'Visitante',
            message   : pElem.value,
            idGame : 0
         }));
    }else{
        setNotification(getNamePlayers(player.pos),pElem.value);
        sendMessage(JSON.stringify({
            action : "notification",
            from   :  getNamePlayers(player.pos),
            message   : pElem.value,
            idGame : game.idGame 
     }));
    }
    pElem.value = "";
}

function setNotification(pFrom,pValue){
    elem = getElem("console");
    elem.innerHTML+=
        "<div>" + 
            getCurrentTime() + " > " + pFrom + " > " + pValue +
        "</div>";
    elem.style.display = "block";
    getElem("icon-console").setAttribute("class","fas fa-eye");
}





