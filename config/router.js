var Repo = require('../lib/repo');
var User = require('../lib/user');

module.exports = function(server) {
  server.get('/me', function(req, res, next) {
    var token = req.headers.access_token;
    var user = new User(token);

    user.me(function(err, data) {
      res.send({
        user: data
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

  server.get('/repos', function(req, res, next) {
    var token = req.headers.access_token;
    var userId = req.params.user_id;
    var repoId = req.params.repo_id;
    var repo = new Repo(token);

    repo.load(userId, repoId, function(info) {
      res.send({
        repos: info
      });

      return next();
    });
  });

  server.post('/repos/:repo_id', function(req, res, next) {
    // TODO: Sanetize data
    var token = req.headers.access_token;
    var repoId = req.params.repo_id;
    var repo = new Repo(token);

    repo.subscribe(repoId).then(function() {
      res.send({
        status: "ok"
      });

      return next();
    }).catch(function(err) {
      res.send({
        status: "error",
        message: err.message,
        errors: err.errors
      });

      return next();
    });
  });
};