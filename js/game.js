function saveGame(){
    initWS("games.php?p=update","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            console.log(ws.responseText);
            /*let resp = JSON.parse(ws.responseText);
            if(resp.status == 1){
                
            }*/
        }
    }
    ws.send(JSON.stringify({idGame : game.idGame, game : game}));
}

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

function dealCards(){
    let cards = [];
    let pos = 1;
    for(let a = game.currentCard ; a < game.currentCard + (game.players.length * 2) ; a ++){
         cards.push(game.cards[a]);
         if(player.pos == pos++){
            player.c1 = cards[a];
         }
    }
    pos = 1;
    for(let a = parseInt(cards.length / 2) ; a < cards.length ; a ++){
        if(player.pos == pos++){
            player.c2 = cards[a];
         }
    }

    game.currentCard+= cards.length;

    if(game.currentCard > (game.cards.length - (game.players.length * 2))){
        game.currentCard = 3;
    }
    

}


function init(){
    elem = getElem("table");
    let pos = player.pos;
    for(let a = 1 ; a < elem.children.length ; a++){
        elem.children[a].classList.add('hide');
        elem.children[a].id = "p" + pos++;
        if(pos > 5){
            pos = 1;
        }
    }
}

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
            elem.classList.remove('current');
        }
    }

    if(game.status == "A"){
        const index = game.players.findIndex(objeto => objeto.pos === player.pos);
        if(game.players[index].host){
            getElem("div-start-game").style.display = "flex";
        }else{
            hide("div-start-game");
        }
        return;
    }

    elem = getElem("p" + game.currentPlayer);
    elem.classList.add('current');
   

}

function createGame(){
    let   cards = [];

    for(let a=0;a <52 ; a++){
        cards[a] = a+1;
    }
    shuffleCards(cards);

    player = {
        idGame : 0,
        pos : 1 ,
        c1  : 0,
        c2  : 0
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
            {pos : 1, value :100, status:1, name:"Cell", ia: false, host: true}
        ]
    };
    
    initWS("games.php?p=create","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
             resp = JSON.parse(ws.responseText);
             game.idGame = resp.idGame;
             player.idGame = game.idGame;
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
            if(resp.status == 1){
                game = resp.game;
                game.idGame = resp.idGame;

                enterGame();
            }
        }
    }
    ws.send(JSON.stringify({idGame : form.idGame.value}));
    
}

function enterGame(){
    const form = getElem("form-join-game");

    player = {
        idGame : game.idGame,
        pos : parseInt(form.idPlayer.value),
        c1 : 0,
        c2 : 0
    }
    // verifica se player já esta no jogo, caso não adiciona.
    const index = game.players.findIndex(objeto => objeto.pos === player.pos);

    if (index === -1) {
        game.players.push({
             pos : player.pos,
             value :  game.buyin,
             status : 1,
             name : getNamePlayers(player.pos),
             ia : false,
             host:false
        });        
    } 
    init();
    showGame();
    
    sendMessage(JSON.stringify({
         action : "Enter",
         idGame : game.idGame,
         game   : game
     }));

     saveGame();
}

function startGame(){
    if(game.status == "A" && game.players.length == 1) {
        openModal("Número de jogadores insuficiente para iniciar a partida!");
        return;
    }
    game.status = "N";
    hide("div-start-game");
    dealCards();
    showGame();
}