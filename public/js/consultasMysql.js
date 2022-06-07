const mysql = require('mysql');
var fras={};
//insertar datos
function insert(connection,datos,callback){
   //ejemplo de query//
    let insertQuery="INSERT INTO partida (Max_jugadores,Cant_jugadores,PIN_acceso,Turno_jugador,Ganador) VALUES (?,?,?,?,?)";
    let query= mysql.format(insertQuery,[datos.maxJugadores,datos.cantJugadores,datos.pinAcceso,datos.turnoJugador,datos.ganador]);
    let selectQuery="SELECT Id_partida FROM partida ORDER BY Id_partida DESC LIMIT 1";
    let insertQuery2="INSERT INTO frases (Id_partida_fra,Texto_fra,Pista_fra) VALUES (?,?,?)";
    let resu1={};
    let resu2={};
    connection.query(query,function(err,result){
        if (err) throw err;
        resu1=result;
        //callback(result);
        console.log(resu1);
    });
    var Id_partida;
    connection.query(selectQuery,function(err,result){
        if (err) throw err;
        Id_partida=result[0].Id_partida;
        console.log("ID PARTIDA dentro: "+Id_partida);
        let query2= mysql.format(insertQuery2,[Id_partida,datos.Frase,"Despejada"]);
            connection.query(query2,function(err,result){
                if (err) throw err;
                resu2=result;
             console.log(resu2);
            //callback(result);
    });
    });
    console.log("ID PARTIDA fuera: "+Id_partida);
    
    callback({partida:resu1,frase:resu2});
}

function agregarJug(connection,datos){
    let insertQuery="INSERT INTO jugador (Id_partida_jug,Alias_jug,Puntaje_jug) VALUES (?,?,?)";
    let query= mysql.format(insertQuery,[datos.Partida,datos.Alias,datos.Puntaje])
    let updateQuery="UPDATE partida SET Cant_jugadores = ? WHERE Id_partida = ?";
    let query2=mysql.format(updateQuery,[datos.Jugadores+1,datos.Partida]);
    connection.query(query,function(err,result){
        if (err) throw err;
    });
    connection.query(query2,function(err,result){
        if (err) throw err;
    });
}

//no la usa x q trae en la consulta inicial de "read"
/*function traeFrase(connection,datos){
    let selectQuery="SELECT * FROM frases WHERE Id_partida_fra=?";
    let query=mysql.format(selectQuery,datos.Partida);
    connection.query(query,function(err,result){
        if(err) throw err;
        //console.log(result);
        for (var i = 0; i<result.length; i++) {
            fras[i]=result[i].Texto_fra;

        }
        console.log(fras);       
    })
}*/

//BuscarPartida
function read(connection,datos,callback){
    let selectQuery="SELECT * FROM partida, frases WHERE PIN_acceso=? and frases.Id_partida_fra = partida.Id_partida";
    let query=mysql.format(selectQuery,datos.PIN)
    connection.query(query,function(err,result){
        if(err) throw err;
        if(result.length>0){
            console.log("cantidad de jugadores: "+result[0].Cant_jugadores);
            if(result[0].Cant_jugadores<3){
                agregarJug(connection,{Partida:result[0].Id_partida,Alias:datos.jugador,Puntaje:0,Jugadores:result[0].Cant_jugadores});
                console.log("jugador: "+datos.jugador+" Agrgado a Partida: "+result[0].PIN_acceso);
                //traeFrase(connection,{Partida:result[0].Id_partida});
                for (var i = 0; i<result.length; i++) {
                    fras[i]=result[i].Texto_fra;
                    console.log(fras[i]);

                }
                console.log(fras);
                console.log("partida encontrada");
                callback({Partida:result[0].PIN_acceso, Jugador:datos.jugador,Frases:fras});
            }else{
                console.log("partida llena");
                callback("partida llena");
            }
        }else{
            console.log("partida inexistente");
            callback("partida inexistente");
        }

    });
}


module.exports={insert,read};