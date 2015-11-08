var restify = require('restify');
var Stat = require('./lib/stat');
var server = restify.createServer({
  name: 'gitspy',
  version: '0.1.0'
});
var PORT = 8080;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/stats', function (req, res, next) {
  var userId = req.params.user_id;
  var repoId = req.params.repo_id;
  var stat = new Stat(userId, repoId);

  stat.load(function(err, info) {
    res.send(info);

    return next();
  });
});

server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});