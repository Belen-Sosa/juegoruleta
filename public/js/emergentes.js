function abrirCreditos() {
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("creditosDiv").style.visibility = "visible";
}

function cerrarCreditos() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("creditosDiv").style.visibility = "hidden";
}
/*ruleta*/
function abrirRuleta() {
  document.getElementById("canvas").style.visibility="visible";
  /*document.getElementById("solapaDivRuleta").style.visibility = "visible";
  document.getElementById("cerrarRuleta").style.visibility = "visible";*/

}

function cerrarruleta() {
  document.getElementById("cerrarRuleta").style.visibility = "hidden";
  document.getElementById("canvas").style.visibility = "hidden";
  document.getElementById("solapaDivRuleta").style.visibility = "hidden";
}


/* */

function abrirMenu() {
  cerrarMenu2();
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("menuDiv").style.visibility = "visible";
}

function cerrarMenu() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("menuDiv").style.visibility = "hidden";
}
function abrirMenu2() {
  cerrarMenu();
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("menuDiv2").style.visibility = "visible";
}

function cerrarMenu2() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("menuDiv2").style.visibility = "hidden";
}
function abrirMenuBuscarPartida() {
  cerrarMenu2();
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("menuBuscarPartida").style.visibility = "visible";
}

function cerrarMenuBuscarPartida() {
  abrirMenu2();
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("menuBuscarPartida").style.visibility = "hidden";
}
function abrirMenuCrearPartida() {
  cerrarMenu2();
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("menuCrearPartida").style.visibility = "visible";
}
function cerrarMenuCrearPartida() {
  abrirMenu2();
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("menuCrearPartida").style.visibility = "hidden";
}
function abrirInstrucciones() {
  document.getElementById("solapaDiv").style.visibility="visible";
  document.getElementById("instruccionesDiv").style.visibility = "visible";
}

function cerrarInstrucciones() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("instruccionesDiv").style.visibility = "hidden";
}


function abrirAgregarFrase() {
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("agregarFraseDiv").style.visibility = "visible";
}

function cerrarAgregarFrase() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("agregarFraseDiv").style.visibility = "hidden";
}


function abrirComprarVocal() {
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("comprarVocalDiv").style.visibility = "visible";
 
}

function cerrarComprarVocal() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("comprarVocalDiv").style.visibility = "hidden";
}


function abrirResolverFrase() {
  document.getElementById("solapaDiv").style.visibility = "visible";
  document.getElementById("resolverFraseDiv").style.visibility = "visible";
 
}

function cerrarResolverFrase() {
  document.getElementById("solapaDiv").style.visibility = "hidden";
  document.getElementById("resolverFraseDiv").style.visibility = "hidden";
}

