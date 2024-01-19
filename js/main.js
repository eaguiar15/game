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



