const socket = io.connect();


socket.emit('nuevoJugador');

console.log(socket.id +" esta es su id");


//variables de la ruleta
 var ctx;
 var text;
let fraseVentana="";
let banderaPuntuacion; //para saber si suma o resta a las puntuaciones de los jugadores
let puntuacion = 0; 
var puntuacionJ1=0;
var puntuacionJ2=0;
var puntuacionJ3=0;
let numIntentos = 2;
let cantidadVecesLetra=0;
let numIntentosOriginales = numIntentos;
var banderaHayConsonante;
var valorRuleta=0;
var listaPalabras = [];
let palabraAdivinar = [];
let palabraAdivinarLetras=[];
let palabraMostrar = [];
let teclasBloqueadas = [];
let teclasHabilitadas= [];
let listaConsonantes=["b","c","d","f","g","h","j","k","l","m","n","ñ","p","q","r","s","t","v","w","x","y","z"];
let listaVocales=["a","e","i","o","u"];
let nodoPista = document.querySelector('#pista');
let nodoResultado = document.querySelector('#resultado').firstChild;
let nodoIntentos = document.querySelector('#intentos');
let nodoIntentosOriginales = document.querySelector('#intentosOriginales');
let nodoPuntuacionJ1 = document.querySelector('#puntuacionH2J1');
let nodoPuntuacionJ2 = document.querySelector('#puntuacionH2J2');
let nodoPuntuacionJ3 = document.querySelector('#puntuacionH2J3');
let nodoBotonReiniciar = document.querySelector('#BotonReiniciar');
let nodoAltavoz = document.querySelector('#altavoz');
document.getElementById("comprarVocal").disabled = true;
// Variables para los sonidos
var fallar = new Audio('media/perder.mp3');
var acertar = new Audio('media/acertar.mp3');
var fondo = new Audio('media/fondo.mp3');
fondo.loop = true; // Hacemos que si termina la música de fondo se repita
fondo.volume = 0.2; // Establecemos el volumen
var width=127;

//controlar cantidad de jugadores y turnos
var jugadores;

var turno=0;
/**
 * Función para inciar la partida, usada cuando carga la página y cuando empieza
 * una partida nueva
 */
function iniciarPartida() {

  
  
  // Generamos un número aleatorio entre el 0 y la longitud de la lista de palabras (fichero palabras.js)
  var posicionAleatoria = Math.floor(Math.random() * listaPalabras.length);

  // Si la posición generada no es par, restamos 1 para que lo sea
  // Palabras = Pares | Pistas = Impares
  if (posicionAleatoria % 2 != 0) {
    posicionAleatoria -= 1;
  }

  // Almacenamos la palabra aleatoria en palabraAleatoria cogiendo la palabra
  // de la lista de palabras con la posicion aleatoria
  var palabraAleatoria = listaPalabras[posicionAleatoria];

  // Guardamos en tamanioPalabraAleatoria el tamaño de la palabra aleatoria
  var tamanioPalabraAleatoria = palabraAleatoria.length;

  // Guardamos en palabraAdivinar (array) cada uno de los caracteres de la palabra aleatoria
  // En palabra mostrar guardaremos tantos guiones como caracteres tiene la palabra aleatoria
  for (var i = 0; i < tamanioPalabraAleatoria; i++) {
    // Si el caracter elegido no es una letra...
    if (!palabraAleatoria.charAt(i).match(/[a-zñA-ZÑ]/)) {
      // Introducimos en la lista de la palabraAdivinar y palabraMostrar el caracter
      palabraAdivinar.push(palabraAleatoria.charAt(i));
      palabraAdivinarLetras.push(palabraAleatoria.charAt(i))
      palabraMostrar.push(palabraAleatoria.charAt(i));
      // Si lo es...
    } else {
      // Introducimos el caracter en palabraAdivinar y un guión en palabraMostrar
      palabraAdivinar.push(palabraAleatoria.charAt(i).toLowerCase());
      palabraAdivinarLetras.push(palabraAleatoria.charAt(i).toLowerCase());
      palabraMostrar.push("_");
    }
  }
  console.log("palabra agregada");
  console.log(palabraAdivinarLetras);

  // Mostramos la pista con nodoPista.textContent pasandole
  // la posicion de la palabra generada + 1 de la lista de palabras
  //nodoPista.textContent = listaPalabras[posicionAleatoria + 1];

  

  // Llamamos a actualizarDatosPantalla() para refrescar los datos en la pantalla
  socket.emit("actualizoPantalla",{palabraMostrar:palabraMostrar, palabraAdivinar:palabraAdivinar,turno:turno,puntuacionJ1:puntuacionJ1,puntuacionJ2:puntuacionJ2,puntuacionJ3:puntuacionJ3});
  //actualizarDatosPantalla();

  
}





/**
 * Función para dibujar los cambios en pantalla
 */
function actualizarDatosPantalla() {
  
  // Pasamos palabraMostrar a un String y separamos cada posición con un espacio con el método join()
  // Luego lo mostramos en el div resultado con nodoResultado.textContent y en mayúsculas
  
  console.log("se estan actualizando los datos ")

  nodoResultado.textContent = palabraMostrar.join(' ').toUpperCase();

  

  
  // Mostramos el máximo de números errores con nodoIntentosOriginales.textContent
 // nodoIntentosOriginales.textContent = numIntentosOriginales;
  // Mostramos el números de intentos actuales con nodoIntentos.textContent
  //nodoIntentos.textContent = numIntentos;
  if (jugadores.length==1){
    // Mostramos la puntuación del usuario
  nodoPuntuacionJ1.textContent = "Jugador 1: "+ puntuacionJ1 + " puntos";
  };
  if(jugadores.length==2){
     // Mostramos la puntuación del usuario
  nodoPuntuacionJ1.textContent = "Jugador 1: "+ puntuacionJ1 + " puntos";
  nodoPuntuacionJ2.textContent = "Jugador 2: " + puntuacionJ2+ " puntos";
  }

    if(jugadores.length>=3){
  // Mostramos la puntuación del usuario
  nodoPuntuacionJ1.textContent = "Jugador 1: "+ puntuacionJ1 + " puntos";
  nodoPuntuacionJ2.textContent = "Jugador 2: " + puntuacionJ2+ " puntos";
  nodoPuntuacionJ3.textContent = "Jugador 3: " +puntuacionJ3+ " puntos";
    }
  

 

  
  if (turno==0){
    if(puntuacionJ1 >=200){
      document.getElementById("comprarVocal").disabled = false;
      
    }else{
      document.getElementById("comprarVocal").disabled = true;
    }
  }else if(turno==1){
    if(puntuacionJ2 >=200){
      document.getElementById("comprarVocal").disabled = false;
      
    }else{
      document.getElementById("comprarVocal").disabled = true;
    }
  }else if(turno==2){
    if(puntuacionJ3 >=200){
      document.getElementById("comprarVocal").disabled = false;
      
    }else{
      document.getElementById("comprarVocal").disabled = true;
    }
  }

  //if(banderaHayConsonante==false && puntuacion<200){

    //fraseVentana="!No te quedan puntos para comprar consonantes, Has perdido¡.";
    //abrirVentanainfo();
    // Bloqueamos todas las teclas para que el usuario no pueda clickar las restantes
    //bloquearTodasTeclas()

    // Igualamos palabraMostrar a palabraAdivinar para mostrar la palabra
    // a encontrar cuando hayamos perdido
    //palabraMostrar = palabraAdivinar;
    // Cambiamos el texto del botón de reiniciar a "Reintentar"
    //nodoBotonReiniciar.textContent = "reintentar";
 // }
}


function actualizarPuntuacion (puntuacion){

  if(turno==0){
    if(banderaPuntuacion=="se resta"){
      puntuacionJ1-= puntuacion;
      if (puntuacionJ1<0)puntuacionJ1=0;
    }else if(banderaPuntuacion=="bancarrota"){
          puntuacionJ1=0;
    }else if(banderaPuntuacion==""){
    puntuacionJ1= puntuacionJ1+puntuacion;
    }
  }else if(turno==1){
    
    if(banderaPuntuacion=="se resta"){
      puntuacionJ2-= puntuacion;
      if (puntuacionJ2<0)puntuacionJ2=0;
    }else if(banderaPuntuacion=="bancarrota"){
      puntuacionJ2=0;
    }else if(banderaPuntuacion==""){
    puntuacionJ2=puntuacionJ2+puntuacion;
    }

  }else if(turno==2){
    if(banderaPuntuacion=="se resta"){
      puntuacionJ3-= puntuacion;
      if (puntuacionJ3<0)puntuacionJ3=0;
    }else if(banderaPuntuacion=="bancarrota"){
      puntuacionJ3=0;
    }else if(banderaPuntuacion==""){
    puntuacionJ3=puntuacionJ3+puntuacion;
    }
  };
};

/**
 * Función que captura la tecla pulsada mediante el teclado físico,
 * comprueba que no se haya pulsado todavía y se la pasa a la función
 * comprobarTecla
 */
function cogerTecladoFisico(evObject) {
  var capturado = String.fromCharCode(evObject.which);
  if (!teclasBloqueadas.includes("tecla" + capturado)) {
    comprobarTecla(capturado);
  }
}



function resolverFrase(){
  
  let fraseAdivinada= document.getElementById("fraseAdivinada").value;
  document.getElementById("fraseAdivinada").value="";
  bloquearTodasTeclas();
   cerrarResolverFrase();
   //converimos el arrary de la palabra adivinar a string 
  let palabraAdivinarString = palabraAdivinar.toString();
  palabraAdivinarString= palabraAdivinarString.replace(/,/g,"");
  
  //si la frase que se ingreso es igual a la frase a adivinar ya la mostramos por pantalla
  if (fraseAdivinada == palabraAdivinarString){
    palabraMostrar=fraseAdivinada;
    puntuacion= 500;
    banderaPuntuacion="";
    actualizarPuntuacion(puntuacion);
   
  };

  // Si no es la frase correcta
  if (fraseAdivinada != palabraAdivinarString) {
    fraseVentana="La frase que ingreso el Jugador " + (turno+1)+ "es incorrecta.";
     socket.emit("fraseVentana", fraseVentana);
   
    
    

     //cambiamos el turno al siguiente jugador 
   
      //me fijo si no es una partida de un jugador
      if(jugadores.length>1){
        if(turno < jugadores.length -1){
          turno= turno+ 1;
        }else{
          turno = 0 ;
        }

      } 
    fraseVentana= "Es el turno del jugador " + (turno+1);
    socket.emit("fraseVentana", fraseVentana);
  }
  estadoPartida();

  socket.emit("actualizoPantalla",{palabraMostrar:palabraMostrar, palabraAdivinar:palabraAdivinar,turno:turno,puntuacionJ1:puntuacionJ1,puntuacionJ2:puntuacionJ2,puntuacionJ3:puntuacionJ3});

} 


/**
 * Función para comprobar si la tecla pulsada es correcta
 */
function comprobarTecla(letraUsuario) {

  console.log("se escogio la letra:" +letraUsuario);
  //si la letra del usuario es una vocal, restamos 200 puntos de su puntaje
  if(letraUsuario=="a" || letraUsuario=="e"  || letraUsuario=="i"  || letraUsuario=="o"  || letraUsuario=="u"  ){
       
    puntuacion = 200;
    banderaPuntuacion= "se resta";
    cerrarComprarVocal();
    

    actualizarPuntuacion(puntuacion);

  }
   

  // Recorremos todo el array de la palabra a adivinar comparando cada posición con la letra del usuario
  for (var i = 0; i < palabraAdivinar.length; i++) {
    // Si la letra del usuario es igual a la letra en i posición, la guardamos en i posición de palabraMostrar
    if (letraUsuario == palabraAdivinar[i]) {


      //me fijo si la letra ya fue adivinada
       if(letraUsuario== palabraMostrar[i]){
         
          //cambiamos el turno al siguiente jugador 
        
          //me fijo si no es una partida de un jugador
          if(jugadores.length>1){
            if(turno < jugadores.length -1){
              turno= turno+ 1;
            }else{
              turno = 0 ;
            }

          }

      }else{
      //guardamos la cantidad de veces que aparece la letra
      cantidadVecesLetra+=1;
      acertar.load();
      acertar.play();
      palabraAdivinarLetras.splice(i,1,"");
      console.log("letras que quedan");
       console.log(palabraAdivinarLetras);

      palabraMostrar[i] = letraUsuario;
      }

       
      
      
    }
    
    
  }
 

  
  //multiplico la cantidad de veces que esta la letra pór el valor de la ruleta y sumo a la puntuacion

  if(cantidadVecesLetra!=0){
   let multiplicacion= cantidadVecesLetra* valorRuleta;
   puntuacion= multiplicacion;
   banderaPuntuacion="";
   actualizarPuntuacion(puntuacion);
  }
    
  

  //despues de la operacion reiniciamos valores y bloqueamos teclado 
  valorRuleta=0;
  cantidadVecesLetra=0;
  bloquearTodasTeclas();


  
 
 
  // Si no está la letra....
  if (!palabraAdivinar.includes(letraUsuario)) {
    fraseVentana="La frase no contiene la letra " + letraUsuario;
    socket.emit("fraseVentana", fraseVentana);
   
    
    
     //cambiamos el turno al siguiente jugador 
   
    //me fijo si no es una partida de un jugador
    if(jugadores.length>1){
      if(turno < jugadores.length -1){
        turno= turno+ 1;
      }else{
        turno = 0 ;
      }

    }
   fraseVentana= "Es el turno del jugador " + (turno+1);
    socket.emit("fraseVentana", fraseVentana);

    
    // Añadimos la tecla a un array para posteriormente trabajar con ellas
    teclasBloqueadas.push("tecla" + letraUsuario);

  }
  //enviamos de quien es el nuevo turno para que le habilite el boton de girar ruleta
  socket.emit('turno',{jugador:turno});

  estadoPartida();
  console.log("puntuacion j1:" + puntuacionJ1 +" , puntuacion j2:"+ puntuacionJ2+ ",puntuacion j3:"+ nodoPuntuacionJ3);
  socket.emit("actualizoPantalla",{palabraMostrar:palabraMostrar, palabraAdivinar:palabraAdivinar,turno:turno,puntuacionJ1:puntuacionJ1,puntuacionJ2:puntuacionJ2,puntuacionJ3:puntuacionJ3});
  
 }
  

/**
 * Función para comprobar si ya ha acabado el juego
 */
function estadoPartida() {
  // Si no quedan guiones...
  if (!palabraMostrar.includes('_')) {
    fraseVentana="¡Enhorabuena,  Jugador " + (turno+1)  +" has ganado!" ;
    palabraMostrar = palabraAdivinar;
    socket.emit("fraseVentana", fraseVentana);
    // Bloqueamos todas las teclas para que el usuario no pueda clickar las restantes
    bloquearTodasTeclas();
    
    // Cambiamos el texto del botón de reiniciar a "Siguiente" y mostramos una nueva imagen

    //nodoBotonReiniciar.textContent = "Siguiente";
    
  }
 
  // Si no quedan intentos lanzamos una alerta
  //if (numIntentos == 0) {
    // Bloqueamos todas las teclas para que el usuario no pueda clickar las restantes
  //  fraseVentana="¡Mala suerte,has perdido!" ;
  //  abrirVentanainfo();
  //  bloquearTodasTeclas()

    // Igualamos palabraMostrar a palabraAdivinar para mostrar la palabra
    // a encontrar cuando hayamos perdido
  //  palabraMostrar = palabraAdivinar;
    // Cambiamos el texto del botón de reiniciar a "Reintentar"
  //  nodoBotonReiniciar.textContent = "reintentar";
  //}

  
}

/**
 * Función para bloquear todas las teclas del teclado, la usaremos cuando finalice la partida
 */
function bloquearTodasTeclas() {
  // Guardamos en un array todos los botones con la clase tecla
  var teclas = document.querySelectorAll('button.tecla');
  
  // Recorremos la lista y vamos deshabilitando las teclas, cambiando su estilo
  // y las añadimos a la lista de teclas bloqueadas
  for (var i = 0; i < teclas.length; i++) {
    teclas[i].disabled = true;
    document.getElementById(teclas[i].id).className = "teclaDeshabilitada";
    teclasBloqueadas.push(teclas[i].id);
  }
}

function habilitarTodasTeclas() {
  for (var i = 0; i < teclasBloqueadas.length; i++) {
    document.getElementById(teclasBloqueadas[i]).disabled = false;
    document.getElementById(teclasBloqueadas[i]).className = "tecla";
  }

  // Vaciamos el array de teclas bloqueadas una vez se hayan
  // desbloqueado las teclas
  teclasBloqueadas = [];
  //puntuacion=0;
  //banderaPuntuacion="";
  //actualizarPuntuacion(puntuacion);
  socket.emit("actualizoPantalla",{palabraMostrar:palabraMostrar, palabraAdivinar:palabraAdivinar,turno:turno,puntuacionJ1:puntuacionJ1,puntuacionJ2:puntuacionJ2,puntuacionJ3:puntuacionJ3});

}
/**
 * Función para reiniciar la partida sin recargar la web entera y así ahorrar recursos
 */
function reiniciarPartida() {
 //ennviamos quien comenzo partida
  socket.emit('comenzoPartida',turno);
 //enviamos de quien es el turno
  socket.emit('turno',{jugador:turno});
 
  
 


  palabraAdivinar = [];
  palabraMostrar = [];
  numIntentos = numIntentosOriginales;
  puntuacionJ1=0;
  puntuacionJ2=0;
  puntuacionJ3=0;

  // Si reinicias la partida la puntuación se restablecerá
  if (nodoBotonReiniciar.textContent == "Reiniciar") {
    puntuacion = 0;
  }

  // Restablecemos la imagen y el texto del botón de reinicio
  nodoBotonReiniciar.textContent = "Reiniciar";
  document.getElementById('imagen').src = 'img/svg/horca.svg';

  // Vamos recorriendo el array de teclasBloqueadas para restablecerlas
  for (var i = 0; i < teclasBloqueadas.length; i++) {
    document.getElementById(teclasBloqueadas[i]).disabled = false;
    document.getElementById(teclasBloqueadas[i]).className = "tecla";
  }

  // Vaciamos el array de teclas bloqueadas una vez se hayan
  // desbloqueado las teclas
  teclasBloqueadas = [];

  // Lanzamos de nuevo la función de iniciar la partida
  iniciarPartida();
}




// Al cargar la página hacemos que capture el evento de tecla pulsada
//window.onload = function() {
//  document.onkeypress = cogerTecladoFisico;
//}


function agregarFrase(){
     
  for(var palabra of listaPalabras){
      console.log(palabra);
    }

  

  
  let dato= document.getElementById("frase").value;
  listaPalabras.push(dato);
  for(var palabra of listaPalabras){
      console.log(palabra);
    }
    document.getElementById("frase").value= "";
  socket.emit("listaPalabras", listaPalabras);

}
function mostrarFrasesCargadas(){
  let resultado = document.getElementById("result");
  resultado.innerHTML="";
  for(const dato of listaPalabras){
    let datoParrafo= document.createElement("h3");
 
    datoParrafo.innerText=dato;
    resultado.appendChild(datoParrafo);
  }
 }


 
 


//abrir menu
abrirCreditos();






//ruleta


var options = [150, 160, 170, 180, 190, 100, 150, 200, "bancarrota"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;



document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    //circulo central
    var insideRadius = 100;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 15;
      ctx.shadowColor   = "rgba(0,0,0,0.9)";
      ctx.fillStyle = "white";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
 
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
 // socket giroRuleta
  socket.emit("rotateWhel",{spinAngleStart:spinAngleStart,spinTime:spinTime,spinTimeTotal:spinTimeTotal});
 
   
  document.getElementById("spin").disabled = true;
  document.getElementById("comprarVocal").disabled = true;
  

}
socket.on("rotateWhel",function(datos){
  spinAngleStart=datos.spinAngleStart;
  spinTime=datos.spinTime;
  spinTimeTotal=datos.spinTimeTotal;
  rotateWheel();
});
function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    socket.emit("stopRotateWheel",{ spinTimeout:spinTimeout,startAngle:startAngle });
    //stopRotateWheel();
  return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  spinTimeout = setTimeout('rotateWheel()', 30);


  drawRouletteWheel();
  socket.emit
  
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  //
  ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 15;
      ctx.shadowColor   = "rgba(0,0,0,0.9)";
  ctx.fillStyle='#fff';
  //
   text = options[index];

  //aca se pone la frase  que quedo en el medio de la ruleta cuando para
  
  valorRuleta=text;

  

  if(valorRuleta!=0 && valorRuleta!="bancarrota"){

    
    
    fraseVentana="jugador "+ (turno+1)+ " Debe elegir una consonante por "+ valorRuleta +" puntos.";
    socket.emit("fillText",text)
   
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    
    //paso el puntaje que quedo a lloos demas usuarios
    socket.emit("fraseVentana", fraseVentana);
    socket.emit("habilitarTeclado", turno);
   
  }if(valorRuleta =="bancarrota"){
    puntuacion=0;
    fraseVentana="Mala suerte, la puntuacion del jugador"+ (turno+1)  + "volvera a 0.";
    socket.emit("fraseVentana", fraseVentana);


    banderaPuntuacion="bancarrota";
    actualizarPuntuacion(puntuacion);

    //me fijo si no es una partida de un jugador
    if(jugadores.length>1){
      if(turno < jugadores.length -1){
        turno= turno+ 1;
      }else{
        turno =0;
      }

    }
    //enviamos de quien es el nuevo turno para que le habilite el boton de girar ruleta
    socket.emit('turno',{jugador:turno});
  
    socket.emit("actualizoPantalla",{palabraMostrar:palabraMostrar, palabraAdivinar:palabraAdivinar,turno:turno,puntuacionJ1:puntuacionJ1,puntuacionJ2:puntuacionJ2,puntuacionJ3:puntuacionJ3});
    
  }
  ctx.restore();
}


socket.on("fraseVentana",function(dato){
    fraseVentana= dato;
    abrirVentanainfo();
});




socket.on("usuarioDesconectado", function(dato){
  fraseVentana= "El jugador "+ dato+ " se ah desconectado.";
  abrirVentanainfo();
});
function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}




drawRouletteWheel();






//ventanaEmergente
function mostrarFraseVentana(){
  let ventana = document.getElementById("ventanaEmergenteDiv");
    ventana.innerHTML="";
  
    let datoParrafo= document.createElement("h2");
 
    datoParrafo.innerText=fraseVentana;
    ventana.appendChild(datoParrafo);

    setTimeout(cerrarVentanaInfo,3500);
  }
 
  function abrirVentanainfo() {
    mostrarFraseVentana();
    document.getElementById("solapaDiv").style.visibility = "visible";
    document.getElementById("ventanaEmergenteDiv").style.visibility = "visible";
   
  }


  function cerrarVentanaInfo() {
    document.getElementById("solapaDiv").style.visibility = "hidden";
    document.getElementById("ventanaEmergenteDiv").style.visibility = "hidden";
  }
  



  //sockets
  socket.on('comenzoPartida', function(dato){
    //cerramos menu y bloqueamos todas las teclas para todos los usuarios
    cerrarCreditos();
    bloquearTodasTeclas();
    document.getElementById("spin").disabled = true;
    document.getElementById("resolverFrase").disabled = true;
   
 });
 
  
  
  socket.on('listaJugadores', function(dato){
      jugadores= dato.lista;
     
       alert("lista de jugadores: " + jugadores.length );
  });

  socket.on("pasoFrases",function(dato){
    //console.log(dato);
    var i=0;
      for(var fra of Object.keys(dato)){
        listaPalabras[i]=dato[fra];
        console.log(listaPalabras[i]);
        i++;
      }
  });

    //si hay mas de un jugador avisamos de quien es el turno a todos los usuarios
  
socket.on('turno', function(dato){
      if(jugadores.length >1){
        fraseVentana="Es el turno del jugador numero :" + (dato+1);
        abrirVentanainfo();
      } 

     
   });
  //habilitar la tecla de giro de ruleta solo para el que tiene el turno
socket.on("habilitar", function(dato){
    alert("es tu turno");
    console.log("tu turno");
    document.getElementById("spin").disabled = false;
    document.getElementById("resolverFrase").disabled = false;
    

   
  
  
});


socket.on("habilitarTeclado",function(dato){
  habilitarTodasTeclas();
})

socket.on("listaPalabras", function(dato){
   listaPalabras= dato;
   alert("la palabra se agrego con exito");
   
});

socket.on("actualizoPantalla", function(datos){
 palabraMostrar= datos.palabraMostrar;
 palabraAdivinar= datos.palabraAdivinar;
 turno= datos.turno;
 puntuacionJ1= datos.puntuacionJ1;
 puntuacionJ2= datos.puntuacionJ2;
 puntuacionJ2= datos.puntuacionJ2;


 actualizarDatosPantalla();

});

//datos de ruleta
socket.on("drawRouletteWheel", function(dato){
  startAngle= dato;
  drawRouletteWheel();
});


socket.on("stopRotateWheel", function(datos){
  spinTimeout=datos.spinTimeout;
  startAngle=datos.startAngle ;
  stopRotateWheel();
});