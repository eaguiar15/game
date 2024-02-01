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

    return cards;
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
    
}

async function dealCards(){
    if(game.status == "A"){
        return;
    }

    for(let a in game.players){ // remove player que não tem saldo suficiente para pagar o bind.
        if(game.pot == 0 && game.players[a].value < game.blind){
            if(game.currentPlayer == game.players[a].pos){
                game.currentPlayer = game.players[0].pos;
            }
            game.players.splice(a, 1);
        }
    } 

    if(game.currentCard > (game.cards.length - (game.players.length * 2)) &&
       game.currentPlayer == player.pos 
      ){
          game.cards = shuffleCards(game.cards);
    }

    if(game.currentCard > (game.cards.length - (game.players.length * 2))){    
        game.currentCard = 0;
    }

    let cards = [];
    for(let a = game.currentCard ; a < game.currentCard + (game.players.length * 2) ; a ++){
         cards.push(game.cards[a]);
    }
    console.log(cards);
    const index = game.players.findIndex(objeto => objeto.pos === player.pos);
    player.c1 = cards[index * 2];
    player.c2 = cards[index * 2 + 1];

    game.currentCard+= cards.length;
    
    getElem("card-pot").classList.add("hide");

    for(let a in game.players){
        getElem("give-cards-p" + game.players[a].pos).classList.remove("hide");
    }

    if(game.pot == 0){
        for(let a in game.players){
            if(game.players[a].status == 1){
                game.pot+=game.currentBlind;
                game.players[a].value-=game.currentBlind;
            }
        }
    }
    getElem("slider-bet").max = game.pot;
    if(game.players[index].value < game.pot){
        getElem("slider-bet").max = game.players[index].value ;
    }
    await sleep(800);

    getElem("card-pot").classList.remove("hide");

    for(let a in game.players){
        getElem("give-cards-p" + game.players[a].pos).classList.add("hide");
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
    
    
}

function play(play){
    let AI = false;

    if(play == 0){ // fold 
        playset = {
            action  : "fold",
            c1      : 0,
            c2      : 0,
            potCard : 0, 
            // from    : player.pos,
            from    : game.currentPlayer,
            dealcards : false
        }
    }

    if(play == 1){ // bet
        playset = {
            action  : "bet",
            c1      : player.c1,
            c2      : player.c2,
            potCard : game.cards[game.currentCard++],
            //from    : player.pos,
            from    : game.currentPlayer,
            bet   :   parseFloat(getElem("slider-bet").value),
            died  :   -1
            
        }
        let c1 = getCard(playset.c1);
        let c2 = getCard(playset.c2);
        let pot = getCard(playset.potCard);

        if( (pot > c1 && pot < c2) ||
            (pot > c2 && pot < c1)){
            playset.winner = true;
        }

        //const index = game.players.findIndex(objeto => objeto.pos === player.pos);
        const index = game.players.findIndex(objeto => objeto.pos === game.currentPlayer);
        
        
        if(playset.winner){
            game.players[index].value+=playset.bet;
            game.pot-=playset.bet;
        }else{
            game.players[index].value-=playset.bet;
            game.pot+=playset.bet;
        }
    }
    if(game.players[game.players.findIndex(objeto => objeto.pos === game.currentPlayer)].ia){
        AI = true;
    }
    
    let index = game.players.findIndex(objeto => objeto.pos === player.pos);
    if(game.players[index].value <= 0 && player.pos == game.currentPlayer){
        openModal("Você perdeu infeliz!");
    }

    getElem("slider-bet").max = game.pot;
    
    if(game.players[index].value < game.pot){
        getElem("slider-bet").max = game.players[index].value ;
    }
    // the next player
    index = game.players.findIndex(objeto => objeto.pos > game.currentPlayer);
    if(index == -1){
        index = 0;
    }
    game.currentPlayer = game.players[index].pos;

    game.play++;
    game.round = parseInt(game.play / game.players.length);
    if(game.play % game.players.length == 0 || game.pot == 0){
        playset.dealcards = true;
        
    } 

    if(game.round % 5 == 0 && game.round > 0 && game.currentPlayer == player.pos){
        game.currentBlind+=game.blind;  
    }

    for(let a in game.players){ // remove player 
        if(game.players[a].value <= 0){
            playset.died = game.players[a].pos;
            game.players.splice(a, 1);

        }
    }

   

    if(game.players.length == 1 && game.pot <= 0){
        openModal("Você ganhou seu jaguara!");
        playset.dealcards = false;
    }

    if(!AI){
        sendMessage(JSON.stringify({
            action : "showGame",
            idGame : game.idGame,
            game   : game,
            playset : playset
        }));
    }

    showGame();
    
}

async function showGame(){
    let elem = getElem("game-info");
    elem.children[0].innerText = "Blind: " + game.currentBlind + " / 5";
    elem.children[1].innerText = "Buy in: " + game.buyin;
    elem.children[2].innerText = "Rodada: " + game.round;
    elem.children[3].innerText = "Game: #" + game.idGame;
    
    for(let a = 1 ; a < 5 ; a++){
        let elem = getElem("p" + a);
        elem.classList.add('hide');
    }

    for(let a in  game.players){
        if(game.players[a].status == 1){
            let elem = getElem("p" + game.players[a].pos);
            elem.style.backgroundImage =  "url('./img/players/p" + game.players[a].pos + ".jpg')";
            elem.classList.remove('hide');
            elem.children[0].children[0].innerText = game.players[a].name;
            elem.children[0].children[1].innerText = game.players[a].value.toFixed(2);
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

            let elem = getElem("pot-value");
            elem.classList.remove("hide");
            elem.innerText = game.pot.toFixed(2);

            elem = getElem("p" + playset.from);
            elem.children[2].classList.add("hide");
            elem.children[1].classList.remove("hide");
            elem.children[1].innerText = "Fold"; 
            
            setTimeout(function() { 
                elem.children[1].classList.add("hide");
            }, 3000); 
             
            getElem("p" + game.currentPlayer).classList.add('current');
            if(playset.dealcards){
                dealCards();
            }
        }
        if(playset.action == "bet"){
            if(playset.died != -1){
                getElem("p" + playset.died).classList.add("hide");
            }

            let elem = getElem("p" + playset.from);
            elem.children[1].classList.remove("hide");

            if(playset.from != player.pos){
                elem.children[2].classList.add("hide"); // mini cards
            }
            
            elem.children[1].innerText = playset.bet.toFixed(2);
            await sleep(700);
            showPotCard(playset.potCard);
            
            await sleep(1000); 
            if(playset.from != player.pos)
                setCardShow(playset.from,playset.c1,playset.c2); 
            await sleep(500); 
            if(playset.winner){
                elem.classList.add("win-move");
            }else{
                elem.classList.add("loss-move");
            }
            elem.children[2].classList.add("hide");

            getElem("pot-value").classList.remove("hide");
            getElem("pot-value").innerText = game.pot.toFixed(2);

            await sleep(500);
            if(playset.dealcards){
                await sleep(500);
                dealCards();
            }
            elem.children[1].classList.add("hide");

            getElem("p" + game.currentPlayer).classList.add('current');
           
            setTimeout(function() { 
                elem.classList.remove("win-move");
                elem.classList.remove("loss-move");
                showPotCard();
            }, 3000); 

            getElem("slider-bet").value = 0;
        }
        
    }else{ // primeira jogada, quando da cartas.
        elem = getElem("p" + game.currentPlayer);
        elem.classList.add('current');
    }

    if(player.pos == game.currentPlayer){
        getElem("bet-action").classList.remove("hide");
        getElem("money-bet").innerText = "0.00";
    }else{
        getElem("bet-action").classList.add("hide");
    }
    beckenkampAI();
}

async function beckenkampAI(){ 
    let index =  game.players.findIndex(objeto => objeto.pos === game.currentPlayer);
    if(game.players[index].ia == true){
       let cards = [];
       for(let a = game.currentCard ; a < game.currentCard + (game.players.length * 2) + 4; a ++){
           cards.push(game.cards[a]);
       }
       player.c1 = cards[index * 2];
       player.c2 = cards[index * 2 + 1];

           let delta =  Math.abs(getCard(player.c1) - getCard(player.c2));
           let pot   = game.pot;
           let bet   = 0;
           if(game.players[index].value < pot){
               pot = game.players[index].value;
           }
           
           switch (delta) {
           case 12:
               bet = pot;
               break; 
           case 11:
               bet = pot * 1.0;
               break;
           case 10:
               bet = pot * 1.0;
               break;
           case  9:
               bet = pot * 0.9;
               break;
           case  8:
               bet = pot * 0.7;
               break;
           case  7:
               bet = pot * 0.5;
               break;
           case  6:
               bet = pot * 0.3;
               break;
           
           default:
               bet = 0;
               break;
           }
        if(game.players[index].value < 10 && delta > 6){
            bet = pot;
        }
       if(bet == 0){
           await sleep(2500);
           play(0);
           return;
       }
       
       await sleep(3500);
       getElem("slider-bet").value = bet;
       play(1);
       
   }  
}

function createGame(){
    let   form = getElem("form-create-game");
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
    ias = [{pos : 1, value :parseFloat(form.buyin.value), status:1, name:getNamePlayers(1), ia: false, host: true}];

    for (let a in form.ias.options) {
        if(form.ias.options[a].selected){
            ias.push({
                pos : parseInt(form.ias.options[a].value), 
                value : parseFloat(form.buyin.value), 
                status: 1, 
                name: getNamePlayers(parseInt(form.ias.options[a].value)), 
                ia: true, 
                host: false
            });
        }
    }

    game = { 
        idGame : 0,
        buyin : parseFloat(form.buyin.value),
        pot  : 0,
        blind : parseFloat(form.blind.value),
        status : "A",
        round : 0,
        play  : 0,
        currentPlayer : 1,
        currentBlind : parseFloat(form.blind.value),
        cards : cards,
        currentCard : 0,
        players : ias
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
    init();
    showGame();
    
    
}

function startGame(){
    if(game.status == "A" && game.players.length == 1) {
        openModal("Número de jogadores insuficiente para iniciar a partida!");
        return;
    }
    game.status = "N";
    hide("div-start-game");
    sendMessage(JSON.stringify({
        action : "dealCards",
        idGame : game.idGame,
        game   : game
    }));
    dealCards();
    showGame();
}