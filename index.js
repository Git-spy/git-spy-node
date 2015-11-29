var restify = require('restify');
var Repo = require('./lib/repo');
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
    res.send({
      user: {
        id: data.id,
        nickname: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        company: data.company,
        location: data.location,
        bio: data.bio,
        repositories: data.public_repos,
        followers: data.followers,
        following: data.following
      }
    });

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
  var token = req.headers.access_token;
  var userId = req.params.user_id;
  var repoId = req.params.repo_id;
  var repo = new Repo(token);

  repo.load(userId, repoId, function(err, info) {
    res.send({repos: info});

    return next();
  });
});

server.post('/repos/:repo_id', function(req, res, next) {
  // TODO: Sanetize data
  var token = req.headers.access_token;
  var repoId = req.params.repo_id;
  var repo = new Repo(token);

  // TODO: handle error
  repo.subscribe(repoId, function() {
    res.send({status: "ok"});

    return next();
  });
});

server.listen(env.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});