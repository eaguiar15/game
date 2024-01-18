function menu(pOpt){
    pOpt = pOpt.innerText;
    switch (pOpt) {
        case "Criar Partida":
          hide("tab-menu");
          show("tab-create-game");
          break;
        case "Entrar Partida":
            break;
        default:
            show("tab-menu");
            hide("tab-create-game");
          break;
      }
      console.log("essa IDE é foda");
}



