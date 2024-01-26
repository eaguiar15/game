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
}

function hide(pValue){
    getElem(pValue).style.display = "none";
}

function getParam(paramName) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName);
 }

 function toggleFullScreen() {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
         document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
  }

 function showConsole(icon){
      
      if(icon.className == "fas fa-eye-slash"){
          getElem("console").style.display = "block";
          getElem("bet").style.bottom = "120px";
          icon.setAttribute("class","fas fa-eye");
        }else{
          getElem("console").style.display = "none";
          getElem("bet").style.bottom = "30px";
          icon.setAttribute("class","fas fa-eye-slash");
      }
 } 

 function getNamePlayers(option){
    switch (option) {
      case 1: return 'Cell'; 
      case 2: return 'Homer'; 
      case 3: return 'Joaquim'; 
      case 4: return 'Sr. Burns'; 
      case 5: return 'Sr. Kaioh'; 
    
      default: return 'Player'; 
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
          document.forms[1].idGame.focus();
          break;
        case "Criar Jogo":
            hide("tab-create-game");
            show("tab-table-game");
            show("bet");
            break;
        case "Entrar na Partida":
                hide("tab-join-game");
                show("tab-table-game");
                show("bet");
                break;
        default:
            show("tab-menu");
            hide("tab-create-game");
            hide("tab-join-game");
            hide("tab-table-game");
          break;
      }
}

getElem("slider-bet").addEventListener('input', function() {
  getElem("money-bet").innerText = parseFloat(this.value).toFixed(2);  
});


