const sleep = ms => new Promise(resolve => setInterval(() => resolve(), ms));

var ws;
var url = "https://setimodigito.net/api/";

function initWS(pURL,pMethod){
    ws = new XMLHttpRequest();
    ws.open(pMethod,url + pURL,true);
    ws.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
}

function getElem(pValue){
     return document.getElementById(pValue);
}

function show(pValue){
     getElem(pValue).style.display = "block";
     getElem(pValue).style.opacity = "1";
}

function hide(pValue){
    getElem(pValue).style.display = "none";
    getElem(pValue).style.opacity = "0";
}

function getParam(paramName) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName);
 }

 function toggleFullScreen() {
    // Verifica se o modo de tela cheia está ativado.
    if (!document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
      // Ativa o modo de tela cheia para o documento inteiro.
      document.documentElement.requestFullscreen();
    } else {
      // Sai do modo de tela cheia.
      document.exitFullscreen();
    }
  }

 function menu(pOpt){
    pOpt = pOpt.innerText;
    switch (pOpt) {
        case "Criar Partida":
          hide("tab-menu");
          show("tab-create-game");
          break;
        case "Entrar Partida":
          hide("tab-menu");
          show("tab-join-game");
          document.forms[1].P_ID_GAME.focus();
          break;
        default:
            show("tab-menu");
            hide("tab-create-game");
            hide("tab-join-game");
          break;
      }
      console.log("essa IDE é foda");
}



