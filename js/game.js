function showPotCard(pCard){
    getElem("verse-card").style.backgroundImage = "url('./img/cards/" + pCard + ".png')";
    const card = document.getElementById('card-pot');
    card.classList.toggle('flipper');
}

function shuffleCards(cards){
    for (let i = 0; i < cards.length; i++) {
        let j = Math.floor(Math.random() * cards.length);
        let aux = cards[i];
        cards[i] = cards[j];
        cards[j] = aux;
    }
}


function init(){
    elem = getElem("table");
    let pos = player.pos;
    for(let a = 1 ; a < elem.children.length ; a++){
        elem.children[a].id = "p" + pos++;
        if(pos > 5){
            pos = 1;
        }
    }
}

//createGame();

function showGame(){
    let elem = getElem("game-info");
    elem.children[0].innerText = "Blind: " + game.blind + " / 10";
    elem.children[1].innerText = "Buy in: " + game.buyin;
    elem.children[2].innerText = "Rodada: " + game.round;
    elem.children[3].innerText = "Game: #" + game.idGame;

    for(let a in  game.players){
        if(game.players[a].status == 1){
            let elem = getElem("p" + game.players[a].pos);
            elem.style.backgroundImage =  "url('./img/players/p" + game.players[a].pos + ".jpg')";
            elem.classList.remove('hide');
            elem.children[0].children[0].innerText = game.players[a].name;
            elem.children[0].children[1].innerText = game.players[a].value;
        }
    }
}

function createGame(){
    let   cards = [];

    for(let a=0;a <52 ; a++){
        cards[a] = a+1;
    }
    shuffleCards(cards);

    player = {
        game : 0,
        pos : 1   
    }
    game = {
        idGame : 0,
        buyin : 100,
        pot  : 0,
        blind : 2.5,
        status : "A",
        round : 0,
        play  : 0,
        currentPlayer : 1,
        currentBlind : 2.5,
        cards : cards,
        currentCard : 0,
        players : [
            {pos : 1, value :100, status:1, name:"Cell", ia: false}
        ]
    };
    
    initWS("games.php?p=create","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
             resp = JSON.parse(ws.responseText);
             game.idGame = resp.idGame;
             init();
             showGame();
        }
    }
    ws.send(JSON.stringify(game));
}

function getGame(actionType){
    const form = getElem("form-join-game");
    
    initWS("games.php?p=select","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            let resp = JSON.parse(ws.responseText);
            game = resp.game;
            game.idGame = resp.idGame;

            enterGame();
        }
    }
    ws.send(JSON.stringify({idGame : form.idGame.value}));
    
}

function enterGame(){
    const form = getElem("form-join-game");

    player = {
        idGame : game.idGame,
        pos : parseInt(form.idPlayer.value)   
    }
    // verifica se player já esta no jogo, caso não adiciona.
    const index = game.players.findIndex(objeto => objeto.pos === player.pos);

    if (index === -1) {
        game.players.push({
             pos : player.pos,
             value :  game.buyin,
             status : 1,
             name : getNamePlayers(player.pos),
             ia : false
        });        
    } 
    init();
    showGame();
    
    sendMessage(JSON.stringify({
         action : "Enter",
         gameId : 1,
         game   : game.idGame
     }));
}