var github = require('octonode');

function Stat(userId, repoId) {
  this.userId = userId;
  this.repoId = repoId;
};

Stat.prototype.load = function(cb) {
  var client = github.client();
  var repoUri = this.userId + '/' + this.repoId;
  var repo = client.repo(repoUri);
  var user = client.user(this.userId);

  //TODO: Check request limit, pagination
  user.repos(function(err, status, body, headers) {
    console.log('repos', status);
    cb(err, this.getInfo(status));
  }.bind(this));
};

Stat.prototype.getInfo = function(status) {
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

module.exports = Stat;