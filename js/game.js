function saveGame(){
    initWS("games.php?p=update","POST"); 
    ws.onreadystatechange = function(){
        if ( ws.readyState == 4 && ws.status == 200 ) {
            console.log(ws.responseText);
        }
    }
    ws.send(JSON.stringify({idGame : game.idGame, game : game}));
}

function showPotCard(pCard){
    getElem("card-pot").classList.remove("hide");
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
        elem.children[a].classList.add('hide');
        elem.children[a].id = "p" + pos++;
        if(pos > 5){
            pos = 1;
        }
    }
    elem = getElem("give-cards");
    pos = player.pos;
    for(let a = 0 ; a < elem.children.length ; a++){
        elem.children[a].id = "give-cards-p" + pos++;
        if(pos > 5){
            pos = 1;
        }
    } 
    game.pot = 0;
    //getElem("pot-value").classList.add("hide");
    
}

async function dealCards(){
    let cards = [];
    for(let a = game.currentCard ; a < game.currentCard + (game.players.length * 2) ; a ++){
         cards.push(game.cards[a]);
    }
    const index = game.players.findIndex(objeto => objeto.pos === player.pos);
    player.c1 = cards[index * 2];
    player.c2 = cards[index * 2 + 1];

    game.currentCard+= cards.length;

    if(game.currentCard > (game.cards.length - (game.players.length * 2))){
        game.currentCard = 3;
    }
    
    for(let a in game.players){
        getElem("give-cards-p" + game.players[a].pos).classList.remove("hide");
    }

    if(game.pot == 0){
        for(let a in game.players){
            if(game.players[a].status == 1){
                game.pot+=game.blind;
                game.players[a].value-=game.blind;
            }
        }
    }
    getElem("slider-bet").max = game.pot;
    await sleep(800);

    for(let a = 0 ; a < elem.children.length ; a++){
        elem.children[a].classList.add("hide");
    }

    for(let a in game.players){
        if(game.players[a].status == 1){
            let elem = getElem("p" + game.players[a].pos);
            elem.children[2].classList.remove("hide");
            setCards(player.pos,player.c1,player.c2);
        }
    }

    elem = getElem("pot-value");
    if(game.pot != 0){
        elem.classList.remove("hide");
    }
    elem.innerText = game.pot.toFixed(2);
    showPotCard(-1);

}

function play(play){
    if(play == 0){ // fold 
        playset = {
            action  : "fold",
            c1      : 0,
            c2      : 0,
            potCard : 0,
            from    : player.pos
        }
        let index = game.players.findIndex(objeto => objeto.pos > player.pos);
        if(index == -1){
            index = 0;
        }
        game.currentPlayer = game.players[index].pos;

        showGame();
        sendMessage(JSON.stringify({
            action : "showGame",
            idGame : game.idGame,
            game   : game,
            playset : playset
        }));
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

    if(typeof playset !== 'undefined'){
        if(playset.action == "fold"){
            let elem = getElem("p" + playset.from);
            elem.children[2].classList.add("hide");
        }
    }

    elem = getElem("p" + game.currentPlayer);
    elem.classList.add('current');

    if(player.pos == game.currentPlayer){
        //setTimeout(function() {
            getElem("bet-action").classList.remove("hide");
        //}, 1100);
    }else{
        getElem("bet-action").classList.add("hide");
    }
    

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
             openModal("Criado Jogo #" + player.idGame + " aguarde a entrada de outros players!");
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

    if (index === -1) { // só avisa outros players, se jogador ainda não estiver na mesa...
        game.players.push({
             pos : player.pos,
             value :  game.buyin,
             status : 1,
             name : getNamePlayers(player.pos),
             ia : false,
             host:false
        });  
        sendMessage(JSON.stringify({
            action : "Enter",
            idGame : game.idGame,
            game   : game
        }));
        init();
        showGame();
        saveGame();      
    }else{
        sendMessage(JSON.stringify({
            action : "getGame",
            idGame : game.idGame
        }));
    }
    //init();

    //showGame();
    
    
}

function startGame(){
    if(game.status == "A" && game.players.length == 1) {
        openModal("Número de jogadores insuficiente para iniciar a partida!");
        return;
    }
    game.status = "N";
    hide("div-start-game");
    dealCards();
    sendMessage(JSON.stringify({
        action : "dealCards",
        idGame : game.idGame,
        game   : game
    }));
    showGame();
}