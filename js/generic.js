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