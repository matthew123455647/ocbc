var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { login, balance, transfer } = require('./utils/AccountUtil')
app.post('/login', login);
app.get('/balance/:email', balance);
app.post('/transfer', transfer);


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

const server = app.listen(PORT, function () {
console.log(`Demo project at: ${PORT}!`); });

module.exports = { app, server }