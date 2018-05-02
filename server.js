console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const app = express();

// serve files from the public directory
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
// const url = 'mongodb://user:password@mongo_address:mongo_port/databaseName';
// E.g. for option 2) above this will be:
const url =  'mongodb://localhost:27017/db';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});


app.use(bodyParser.json());

// serve the homepage
app.get('/', (req, res) => {
  var movies = db.collection("movies").find().toArray((err, result) => {
     if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {movies: result});
  }); 

});

app.post('/recomienda', (req, res) => {
  console.log("LOL");
  res.render('recomendaciones.ejs', {});
});

app.get('/autocomplete/:search', (req, res) => {
  var search = req.params.search;
  if (search.length < 2)
    return; 

  var exp = new RegExp(search, "i");
  var query = db.collection("movies").find({"title": exp}, {title: 1})
  .limit(5).toArray((err, result) => {
    res.send(JSON.stringify(result));  
  });
  
});

