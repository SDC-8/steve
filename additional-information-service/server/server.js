require('newrelic');
// const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
// const graphqlHTTP = require('express-graphql');
const path = require('path');
// const schema = require('./schema.js');
const pg = require('pg');

const port = 8081;
const bodyParser = require('body-parser');

const app = express();

// connection string
// const connection = "postgres://postgres:102884@localhost:5432/sdc";

const config = {
  user: 'postgres',
  database: 'sdc',
  password: '102884',
  port: 5432
};

const pool = new pg.Pool(config);

// new connection
// const db = new pg.Client(connection);
// db.connect();



// mongoose.Promise = global.Promise;
// mongoose.connect(
//   'mongodb+srv://admin1:admin1password@cluster0-ytvdt.mongodb.net/houses?retryWrites=true/',
//   { useNewUrlParser: true },
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`${__dirname}/../public`));

app.get('/:propertyID', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../public/index.html`));
});

app.get('/listings/:propertyID', (req, res) => {
  const id = req.params.propertyID;
  const select =`SELECT * FROM zillwoah WHERE propertyid = ${id}`;

  pool.connect( (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query(select, (err, result) => {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      console.log('Postgres query return = ', result);
      res.status(200).send(result.rows)
    });
  });
});

app.get('/listings', (req, res) => {
  const id = Math.round(Math.random()*10000000);
  const select =`SELECT * FROM zillwoah WHERE propertyid = ${id}`;

  pool.connect( (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query(select, (err, result) => {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      console.log('Postgres query return = ', result);
      res.status(200).send(result.rows)
    });
  });
});

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   }),
// );

app.listen(port, () => console.log(
  `Express Server Now Running On localhost:${port}/`,
));
