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

createGame();

function showGame(){
    let elem = getElem("game-info");
    elem.children[0].innerText = "Blind: " + game.blind + " / 10";
    elem.children[1].innerText = "Buy in: " + game.buyin;
    elem.children[2].innerText = "Rodada: " + game.round;

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
        game : 1,
        value : 100,
        pos : 1   
    }
    game = {
        game : 1,
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
            {pos : 1, value :100, status:1, name:"Cell", ia: false},
            {pos : 2, value :100, status:1, name:"Homer", ia: false},
            {pos : 3, value :100, status:1, name:"Joaquim", ia: false},
            {pos : 4, value :100, status:1, name:"Burns", ia: false},
            {pos : 5, value :100, status:1, name:"Sr. Kaioh", ia: false}
        ]
    };
    init();
    showGame();
}

function getGame(){
    player = {
        game : 1,
        value : 100,
        pos : 2   
    }
    game = {
        game : 1,
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
            {pos : 1, value :100, status:1, name:"Cell", ia: false},
            {pos : 2, value :100, status:1, name:"Homer", ia: false},
            {pos : 3, value :100, status:1, name:"Joaquim", ia: false},
            {pos : 4, value :100, status:1, name:"Burns", ia: false},
            {pos : 5, value :100, status:1, name:"Sr. Kaioh", ia: false}
        ]
    };
    init();
}
