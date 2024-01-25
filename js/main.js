function showPotCard(pCard){
    getElem("verse-card").style.backgroundImage = "url('../img/cards/" + pCard + ".png')";
    const card = document.getElementById('card-pot');
    card.classList.toggle('flipper');
}