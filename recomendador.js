"use strict";

const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
// Script para ordenarlos de menor a menor en tiempo 0(n log n).
const quick = require('./quicksort'); 


// Clase para almacenar películas.
class Nodo {

	constructor(titulo,valor) {
		this.titulo = titulo;
		this.valor = valor;
	}

	// Compara dos nodos 
  	compareTo(nodo) {
    	return this.valor < nodo.valor;
  	}
};

var db;

const url =  'mongodb://duis:lizzluz@ds215380.mlab.com:15380/movies';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
});

function temp() {
	// Crearlos dinámicamente.
	var items = ["Chihiro","Toy Story","Titanic","Me,Before You","Saving Private Ryan","Kung Fu, Panda "];

	// Idea: crearlos dinámicamente.
	// Géneros provicionales Animación,Fantasía,Drama,Acción,Infantil
	var p1 = [1,1,1,0,1];
	var p2 = [1,0,0,0,1];
	var p3 = [0,0,1,0,0];
	var p4 = [0,0,1,0,0];
	var p5 = [0,0,1,1,0];
	var p6 = [1,0,0,0,1];

	// Las que le gustaron al usuario.
	var gustos = [1,0,0,0,0,0];
	// Cambiarle el nombre
	var matriz_principal = [p1,p2,p3,p4,p5,p6];

	// La suma de cada uno de los atributos de los items, por ejemplo p1 = 3.
	var total_atributes = [0,0,0,0,0,0];
	// Llena el arreglo total_atributes, con las suma de los valores de cada renglón
	for (var i = 0; i < total_atributes.length; i++) {
		for (var j = 0; j < matriz_principal[i].length; j++) {
			total_atributes[i]+=matriz_principal[i][j];
		}
	}

	console.log("User:");
	console.log(user_profile);

	// Aquí va mi desmadre:
	// Le sacamos la norma.
	for (var i = 0; i < matriz_principal.length; i++) {
		for (var j = 0; j < matriz_principal[i].length; j++) {
			// Para no dividir entre cero
			if (total_atributes[i]!=0) {
				matriz_principal[i][j] = matriz_principal[i][j]/Math.sqrt(total_atributes[i]);
				// Redondeamos a tres dígitos
				matriz_principal[i][j] = Math.round(matriz_principal[i][j]*1000)/1000
			}
		}
	}
	// Recordarle mi amor :3
	console.log("Te amo, Liz");

	// Variables de... sacar del artículo.
	var DF = [0,0,0,0,0];
	var IDF =[0,0,0,0,0];
	var user_profile = [0,0,0,0,0];
	// Calculamos DF
	for (var i = 0; i < DF.length; i++) {
		for (var j = 0; j < matriz_principal.length; j++) {
			user_profile[i] += gustos[j]*matriz_principal[j][i];
			if (matriz_principal[j][i] != 0) {
				DF[i] += 1;
			}
			// Calculamos IDF con base en DF.
			IDF[i] = Math.log(10/DF[i])/Math.log(10);
		}
	}

	console.log(user_profile);

	// Comienza a realizar la "predicción".
	var user_prediction = [0,0,0,0,0,0];
	for (var i = 0; i < user_prediction.length; i++) {
		for (var j = 0; j < matriz_principal[0].length; j++) {
			user_prediction[i] += matriz_principal[i][j]*user_profile[j]*IDF[j];
		}
	}

	var recomendaciones = [];
	for (var i = 0; i < user_prediction.length; i++) {
		// recomendaciones[i] = [items[i],user_prediction[i]];
		recomendaciones[i] = new Nodo(items[i],user_prediction[i]);
	}
	quick(recomendaciones,0,recomendaciones.length-1);
	console.log("Después de amar más a Liz");
	console.log("Te recomendamos:");
	var pelicula;
	for (var i = 0; i < recomendaciones.length; i++) {
		pelicula = recomendaciones[i].titulo;
		console.log("- " + pelicula +" con una probabilidad de: " + recomendaciones[i].valor);
	}
}

function recomienda(ids) {
	var objectIds = []
	// Metemos los ids a un arreglo, para buscar las películas.
	ids.forEach((id, index) => {
		objectIds.push(ObjectId(id));
	});
	// Consultamos las peliculas.
	var promise = new Promise((resolve, reject) => {
		db.collection("movies").find({_id: {$in: objectIds}}).toArray((err, result) => {
			if (err) console.log("ERROR");
			resolve(result);
		});

	});
	// Si se realizó correctamente la consulta.
	promise.then((arr) => {
		// Contiene las películas que le gustaron al usuario.
		var peliculas_usuario  = arr;
		// La unión de todos los géneros de las películas qdel usuario.
		var generos = [];
		var gen;
		for (var i = 0; i < peliculas_usuario.length; i++) {
			gen = peliculas_usuario[i].genres;
			// Guardamos los géneros.
			for (var j = 0; j < gen.length; j++) {
				// Para evitar valores repetidos.
				if (generos.indexOf(gen[j]) == -1) {
					generos.push(gen[j]);
				}		
			}
		}
		// Busca las películas que tengan generos en común.
		promise = new Promise((resolve, reject) => {
			db.collection("movies").find({genres: {$in: generos}}).toArray((err, result) => {
				if (err) console.log("ERROR EN MI VIDA, ME FALTA ELLA :(");
				resolve(result);
			});
		});
		// Se empieza a acomodar la matriz.
		promise.then((arr) => {
			// Almacenará las películas que va a recomendar.
			var peliculas = [];
			var generos_aux = [];
			var cont = 0
			// La matriz que representa items x géneros
			var matriz_principal = [];
			var tam = arr.length;
			var total_atributes = crea_arreglo(tam);
			// Representará los items (películas)
			var items = [];
			// Representará los gustos del usuario. Tendrá un 1 si le gusta, -1 si no y 0 si no sé sabe.
			var gustos = crea_arreglo(matriz_principal.length);
			var title;
			// Se llenan todas la matrices.
			// for (var i = 0; i < arr.length; i++) {
			for (var i = 0; i < tam; i++) {
				title = arr[i].title; 
				items[i] = title; 
				// Los géneros de la pelicula actual.
				generos_aux = arr[i].genres;
				// Contador que guardará cuantos atributos tiene en común.
			    cont = 0
				// Ya que están en orden alfabético... cuadrático por el momento
				matriz_principal[i] = [];
				for (var j = 0; j < generos.length; j++) {
					for (var k = 0; k < generos_aux.length; k++) {
						if (generos[j] == generos_aux[k]) {
							total_atributes[i]++;
							cont ++ ;
							matriz_principal[i][j] = 1;
						} else {
							// Si no ha sido asignada
							if (matriz_principal[i][j] != 1) {
								matriz_principal[i][j] = 0;
							}
						}
					}
				}
				// Busca si es de las películas que indicó el usuario.
				for (var j = 0; j < peliculas_usuario.length; j++) {
					if (peliculas_usuario[j].title == title) {
						gustos[i] = 1;
						break;
					}
				}
				// Si no encontró la película.
				if (gustos[i] != 1) {
					gustos[i] = 0;
				}
			}
			// Document Frecuency.
			var DF = crea_arreglo(generos.length);
			// Inverse Document Frecuency.
			var IDF =crea_arreglo(generos.length);
			// Perfil del usuario.
			var user_profile  = crea_arreglo(generos.length);
			// A cada elemento de la matriz lo dividimos entre la raíz cuadrada del número de atributos.
			for (var i = 0; i < matriz_principal.length; i++) {
				for (var j = 0; j < matriz_principal[i].length; j++) {
					// Para no dividir entre cero
					if (total_atributes[i]!=0) {
						matriz_principal[i][j] = matriz_principal[i][j]/Math.sqrt(total_atributes[i]);
						// Redondeamos a cuatro dígitos
						matriz_principal[i][j] = Math.round(matriz_principal[i][j]*1000)/1000
					}
				}
			}

			// Calculamos DF
			for (var i = 0; i < DF.length; i++) {
				for (var j = 0; j < matriz_principal.length; j++) {
					// Llenamos user profile con base en los gustos y lo que encontramos.
					user_profile[i] += gustos[j]*matriz_principal[j][i];
					if (matriz_principal[j][i] != 0) {
						DF[i] += 1;
					}
				}
				// Calculamos IDF con base en DF
				IDF[i] = Math.log(tam/DF[i])/Math.log(tam);
			}

			// Comienza a realizar la "predicción".
			var user_prediction = crea_arreglo(gustos.length);
			for (var i = 0; i < user_prediction.length; i++) {
				for (var j = 0; j < matriz_principal[i].length; j++) {
					user_prediction[i] += matriz_principal[i][j]*user_profile[j]*IDF[j];
				}
			}

			// Guardará las recomendaciones finales ordenadas.
			var recomendaciones = [];
			for (var i = 0; i < user_prediction.length; i++) {
				recomendaciones[i] = new Nodo(items[i],user_prediction[i]);
			}
			// Lo ordenamos de mayor a menor
			quick(recomendaciones,0,recomendaciones.length-1);
			var pelicula;
			for (var i = 0; i < recomendaciones.length; i++) {
				pelicula = recomendaciones[recomendaciones.length-1 -  i].titulo;
				console.log("- " + pelicula +" con una probabilidad de: " + recomendaciones[recomendaciones.length-1 -  i].valor);
			}
			
			console.log("Termina todo");
		});
	});		
};

// Crea un arreglo con n ceros.
function crea_arreglo (n){
	var arreglo = [];
	for (var i = 0; i < n; i++) {
		arreglo[i] = 0;
	}
	return arreglo;
};

function recomienda_old(ids) {
	var objectIds = []
	ids.forEach((id, index) => {
		objectIds.push(ObjectId(id));
	});
	// Consultamos las peliculas que le gustaron a los usuarios.
	var promise = new Promise((resolve, reject) => {
		db.collection("movies").find({_id: {$in: objectIds}}).toArray((err, result) => {
			if (err) console.log("ERROR");

			resolve(result);
		});

	});
	// Si se pudo hacer la primer consulta.
	promise.then((arr) => {
		// Debug purpose
		console.log("Tus pelis: " + arr.length);
		var generos = [];
		var gen = [];
		for (var i = 0; i < arr.length; i++) {
			gen = arr[i].genres;
			// Guardamos los géneros.
			for (var j = 0; j < gen.length; j++) {
				// Para evitar valores repetidos.
				if (generos.indexOf(gen[j]) == -1) {
					generos.push(gen[j]);
				}		
			}
			var titulo = arr[i].title;
			console.log("Titulo: " +  titulo);
			console.log("Género: " + gen);
		}

		console.log(generos);
		// Busca las películas que tengan generos parecidos.
		promise = new Promise((resolve, reject) => {
			db.collection("movies").find({genres: {$in: generos}}).toArray((err, result) => {
				if (err) console.log("ERROR EN MI VIDA, ME FALTA LIZ :(");
				resolve(result);
			});
		});
		// Se empieza a acomodar la matriz.
		promise.then((arr) => {
			// console.log(arr);
			// Debug
			console.log("TE RECOMENDAMOS:");
			// Almacenará las películas que va a recomnedar.
			var peliculas = [];
			var generos_aux = [];
			var cont = 0
			for (var i = 0; i < arr.length; i++) {
				// Los géneros de la pelicula actual.
				generos_aux = arr[i].genres;
				// console.log(generos_aux);
				// Contador que guardará cuantos atributos tiene en común.
			    cont = 0
				// Ya que están en orden alfabético... cuadrático por el momento
				for (var j = 0; j < generos.length; j++) {
					for (var k = 0; k < generos_aux.length; k++) {
						if (generos[j] == generos_aux[k]) {
							cont ++ ;
						} 
					}
				}

				var title = arr[i].title; 
				var peli = new Nodo(title,cont);
				peliculas.push(peli);
			}
			// first call
			var arreglo = peliculas;
			var result = quick(arreglo,0,arreglo.length-1);
			// Debug
			result.forEach((pel,index) => {
				if (index>30) {
					return false;
				}
				console.log(pel.titulo + " conincidencias: " + pel.valor);
			});
		});
	});	
};

module.exports = recomienda;
// module.exports = temp;

/* 
Cosultas:
- db.getCollection('movies').find({"title": /Toy/})
- db.getCollection('movies').find({"title": "Mystery"}) 
- db.getCollection('movies').find({"title": /Fast/})
- db.movies.find({"$and": [{genres: "Crime"}, {genres: "Comedy"}]})
- db.tags.aggregate([{$match: {movieId: "1"}}, {$group: {_id: '$tag', count: {$sum: 1}}}, {$sort: {count: -1}}])
- db.tags.aggregate([{$match: {movieId: "2"}}, {$group: {_id: {$toLower:'$tag'}, count: {$sum: 1}}}, {$sort: {count: -1}}, {$limit:5}])
- db.tags.aggregate([{$match: {movieId: "1"}}, {$group: {_id: '$tag', count: {$sum: 1}}}, {$sort: {count: -1}}])
*/
