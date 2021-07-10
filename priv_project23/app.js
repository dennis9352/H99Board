const express = require('express');
const mongoose = require('mongoose');
const Http = require('http');
const path = require('path');

mongoose.connect('mongodb://localhost/community', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const http = Http.createServer(app);

const usersRouter = require('./routers/users');
const postsRouter = require('./routers/posts');
const commentsRouter = require('./routers/comments');
app.use('/users', express.urlencoded({ extended: false }), [usersRouter]);
app.use('/posts', express.urlencoded({ extended: false }), [postsRouter]);
app.use('/comments', express.urlencoded({ extended: false }), [commentsRouter]);
app.use(express.json());
app.use(express.static('assets'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// 각종 url
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/channel.html'));
});
app.get('/node', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/node.html'));
});
app.get('/react', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/react.html'));
});
app.get('/spring', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/spring.html'));
});
app.get('/read', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/read.html'));
});
app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/register.html'));
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/login.html'));
});
app.get('/write', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/write.html'));
});

module.exports = http;
