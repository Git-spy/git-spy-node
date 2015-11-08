var github = require('octonode');

function Stat(userId, repoId) {
  this.userId = userId;
  this.repoId = repoId;
};

Stat.prototype.load = function(cb) {
  var client = github.client();
  var repoUri = this.userId + '/' + this.repoId;
  var repo = client.repo(repoUri);

  console.log('load', repoUri);

  repo.info(function(err, status, body, headers) {
    cb(err, this.getInfo(status));
  }.bind(this));
};

Stat.prototype.getInfo = function(status) {
  return {
    id: status.id,
    name: status.name,
    avatar_url: status.avatar_url,
    description: status.description,
    total_stars: status.stargazers_count,
    new_stars: 0,
    language: status.language
  };
};

module.exports = Stat;