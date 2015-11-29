var restify = require('restify');
var pg = require('pg');
var Stat = require('./lib/stat');
var User = require('./lib/user');
var env = require('./lib/env');
var server = restify.createServer({
  name: 'gitspy',
  version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// TODO: Move request handlers to different file
server.get('/me', function(req, res, next) {
  var token = req.headers.access_token;
  var user = new User(token);

  user.me(function(err, data, headers) {
    res.send(data);

    return next();
  });
});

server.get('/limit', function(req, res, next) {
  var token = req.headers.access_token;
  var user = new User(token);

  user.limit(function(err, data, headers) {
    res.send({
      limit: {
        requests: data
      }
    });

    return next();
  });
});

server.get('/repos', function (req, res, next) {
  var userId = req.params.user_id;
  var repoId = req.params.repo_id;
  var stat = new Stat(userId, repoId);

  stat.load(function(err, info) {
    res.send({repos: info});

    return next();
  });
});

server.post('/repos/:repo_id', function(req, res) {
  var repoId = req.params.repo_id;
  // TODO: Sanetize data
  res.send({repoId: repoId});
});

var client = new pg.Client(env.databaseUrl);

client.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
});

server.listen(env.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});