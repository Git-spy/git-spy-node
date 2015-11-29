var restify = require('restify');
var pg = require('pg');
var Stat = require('./lib/stat');
var env = require('./environment');
var server = restify.createServer({
  name: 'gitspy',
  version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/repos', function (req, res, next) {
  var userId = req.params.user_id;
  var repoId = req.params.repo_id;
  var stat = new Stat(userId, repoId);

  stat.load(function(err, info) {
    res.send({repos: info});

    return next();
  });
});

var client = new pg.Client(env.databaseUrl);

client.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }

  // client.query("INSERT INTO repository (user_id, name) VALUES ('zzarcon', 'focusable')");

  client.query("select * from repository", function(err, result) {
    console.log("result", result);
  });
});

server.listen(env.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});