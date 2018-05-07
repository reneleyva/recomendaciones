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
// Conexión a mongo
MongoClient.connect(url, (err, database) => {
  if(err) {
  }
  db = database;
});

/**
 * Función que regresa recomendaciones de películas 
 * Basado en filtrado de contenido de películas. 
 * Recibe un arreglo de strings ids, que son los ids en la base de datos
 *  de las películas proporcionadas por el ususario.
 */
function recomienda(ids) {

	// Promesa principal
	return new Promise(resolve => {
		var objectIds = [];
		// Metemos los ids a un arreglo, para buscar las películas.
		ids.forEach((id, index) => {
			objectIds.push(ObjectId(id));
		});
		// Buscamos las películas escogidas por el usuario. 
		db.collection("movies").find({_id: {$in: objectIds}}).toArray((err, arr) => {
			// Contiene las películas que le gustaron al usuario.
			var peliculas_usuario  = arr;
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
			}

			// Busca las películas que tengan generos en común.
			db.collection("movies").find({genres: {$in: generos}}).toArray((err, generosArr) => {
				// Almacenará las películas que va a recomendar.
				var peliculas = [];
				var generos_aux = [];
				var cont = 0
				// La matriz que representa items x géneros
				var matriz_principal = [];
				var tam = generosArr.length;
				var total_atributes = crea_arreglo(tam);
				// Representará los items (películas)
				var items = [];
				// Representará los gustos del usuario. Tendrá un 1 si le gusta, -1 si no y 0 si no sé sabe.
				var gustos = crea_arreglo(matriz_principal.length);
				var title;
				// Se llenan todas la matrices.
				// for (var i = 0; i < arr.length; i++) {
				for (var i = 0; i < tam; i++) {
					title = generosArr[i].title; 
					items[i] = title; 
					// Los géneros de la pelicula actual.
					generos_aux = generosArr[i].genres;
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

				
				var recomendaciones = [];
				for (var i = 0; i < user_prediction.length; i++) {
					// recomendaciones[i] = [items[i],user_prediction[i]];
					recomendaciones[i] = new Nodo(items[i],user_prediction[i]);
				}
				quick(recomendaciones,0,recomendaciones.length-1);
				var pelicula;
				for (var i = 0; i < recomendaciones.length; i++) {
					pelicula = recomendaciones[recomendaciones.length-1 -  i].titulo;
				}

				resolve(recomendaciones);
			});
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

module.exports = recomienda;