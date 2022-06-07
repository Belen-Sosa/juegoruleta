const express= require('express');
const app= express();
//const mysql = require('mysql');
require("dotenv").config();

//conexion mysql
/*const connection = mysql.createConnection({
   host:"localhost",
   user:"root",
   password: "root",
   database: "juegoruleta",
 
});

connection.connect((err)=>{
   if(err) throw err;
   console.log("Conectado a la base ");
})
//consultas mysql 
const {insert,read}= require('../public/js/consultasMysql');

//insertar datos
app.get("/insert",(req,res)=>{
   insert(connection,{maxJugadores:3,cantJugadores:0,pinAcceso:"abcde",turnoJugador:0,ganador:0},(result)=>{
        res.json(result);
        console.log(result);
       
   });

});

//leer datos

app.get("/read",(req,res)=>{
   read(
      connection,
      (result)=>{
         res.json(result);
      }
   );
})
*/

const http = require('http');

const server = http.createServer(app);

server.listen(3000);

app.use(express.static('public'));



//sockets  
const sockerIo = require('socket.io');
//const Connection = require('mysql/lib/Connection');
const io = require('socket.io')(server);


var listaJugadores=[];
var frases;

io.on('connect',function(socket){
   
    

   //se agrega el nuevo jugador con su id a la lista de jugadores
   socket.on("nuevoJugador", function(){
      console.log("se unio un jugador: " + socket.id);
      listaJugadores.push(socket.id).idUsuario;
      console.log("lista de jugadores "+ listaJugadores.length);
      io.emit("listaJugadores",{lista:listaJugadores});
      console.log(" ");
      console.log("USUARIOS CONECTADOS");
      for( var i =0; i < listaJugadores.length ; i++){
         console.log("jugador "+ i+": "+listaJugadores[i]);

      };
      
   });

   //tomams la lista de palabras 
   socket.on("listaPalabras", function(dato){
      frases= dato;
      for( var i =0; i < frases.length ; i++){
         console.log("frase: "+ frases[i]);

      };
      io.emit("listaPalabras",frases);
   })

   

   //nos fijamos quien comenzo partida
   socket.on("comenzoPartida", function(dato){
      console.log(" ");
      console.log("el jugador: " +dato+ " comenzo partida.");
      io.emit("comenzoPartida",dato);
      
   });
  

   //la palabra a mostrar
   socket.on("actualizoPantalla", function(datos){
      console.log("la palabra a adivinar es"+ datos.palabraAdivinar);
      io.emit("actualizoPantalla", {palabraMostrar:datos.palabraMostrar, palabraAdivinar:datos.palabraAdivinar,turno:datos.turno,puntuacionJ1: datos.puntuacionJ1,puntuacionJ2: datos.puntuacionJ2,puntuacionJ3: datos.puntuacionJ3});
   });
   

   //mando la frase de la ventana
   socket.on("fraseVentana", function(dato){
      io.emit("fraseVentana",dato);
   });

   
   //nos fijamos de quien es el turno actual
   socket.on("turno", function(dato){
      console.log("es el turno del jugador numero" + dato.jugador);
      io.emit("turno",dato.jugador);
      io.to(listaJugadores[dato.jugador]).emit('habilitar',dato.jugador);
    
   });
  

   
   
 
  socket.on("rotateWhel",function(datos){
    io.emit("rotateWhel",{spinAngleStart:datos.spinAngleStart,spinTime:datos.spinTime,spinTimeTotal:datos.spinTimeTotal});
  });

  //habilitar teclado

  socket.on("habilitarTeclado",function(dato){
     io.to(listaJugadores[dato]).emit("habilitarTeclado",dato);
  })
   //eliminamos al usuario de la lista de usuarios cuando se desconecta

   socket.on('disconnect',function(){
      idUsuario= socket.id;
      for (var i = 0; i < listaJugadores.length; i++) {
         if(listaJugadores[i]== idUsuario){
            listaJugadores.splice(i,1);
           var  jugador= i;
            console.log("encontrado.");
         }
      }

      console.log("usuario " + idUsuario + " desconectandose...");
      io.emit("usuarioDesconectado",(jugador+1));
      console.log(" ");

      console.log("USUARIOS CONECTADOS ACTUALES:");
      for( var i =0; i < listaJugadores.length ; i++){
         console.log(listaJugadores[i]);

      }

   });

   
  
});