var github = require('octonode');
var DB = require('./db');

function Repo(accessToken) {
  this.accessToken = accessToken;
  this.client = github.client(this.accessToken);
};

Repo.prototype.load = function(userId, repoId, cb) {
  this.userId = userId;
  this.repoId = repoId;

  var repoUri = this.userId + '/' + this.repoId;
  var repo = this.client.repo(repoUri);
  var user = this.client.user(this.userId);

  //TODO: Check request limit, pagination
  user.repos(function(err, status, body, headers) {
    cb(err, this.getInfo(status));
  }.bind(this));
};

Repo.prototype.getInfo = function(status) {
  return status.map(function(repo) {
    return {
      id: repo.id,
      name: repo.name,
      avatar_url: repo.avatar_url,
      description: repo.description,
      total_stars: repo.stargazers_count,
      new_stars: 0,
      language: repo.language,
      last_time_checked: new Date().getTime()
    };
  });
};

Repo.prototype.subscribe = function(repoId, cb) {
  repoId = parseInt(repoId);
  
  var db = new DB();

  db.init().then(function() {
    db.Repo.create({
      userId: 1,
      repoId: repoId
    }).then(cb);
  });
};

module.exports = Repo;