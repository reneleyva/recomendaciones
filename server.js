"use strict";
console.log('Server-side code running');

const recomendador = require('./recomendador'); 
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

let db;


const url =  "mongodb://duis:lizzluz@ds215380.mlab.com:15380/movies";
/* Conexión a Mongo de mlab */
MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000  ');
  });
});


app.use(bodyParser.json());


// Página principal
app.get('/', (req, res) => {
  // renders index.ejs
  res.render('index.ejs', {});

});

// Función asincrona que obtiene el resultado de recomendador. 
async function rendenRecomendaciones(ids, res) {
    var rec = await recomendador(ids);
    console.log(rec);
    res.render('recomendaciones.ejs', {recomiendaciones: rec});
}; 

// Post  para recomienda
app.post('/recomienda', (req, res) => {
  var ids = req.body.peliculas.split(",");
  var rec = rendenRecomendaciones(ids, res); 
});

// Autocompletado del input principal
app.get('/autocomplete/:search', (req, res) => {
  var search = req.params.search;
  var exp = new RegExp(search, "i");
  var query = db.collection("movies").find({"title": exp}, {title: 1})
  .limit(5).toArray((err, result) => {
    res.send(JSON.stringify(result));  
  });
  
});

