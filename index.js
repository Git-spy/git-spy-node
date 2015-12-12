var restify = require('restify');
var env = require('./config/environment');
var router = require('./config/router');
var server = restify.createServer({
  name: 'gitspy',
  version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

router(server);

server.listen(env.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});