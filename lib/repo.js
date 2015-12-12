var _ = require('lodash');
var github = require('octonode');
var DB = require('./db');
var User = require('./user');
var Promise = require('rsvp').Promise;

function Repo(accessToken) {
  this.accessToken = accessToken;
  this.client = github.client(this.accessToken);
  this.user = new User(this.accessToken);
};

Repo.prototype.load = function(userId, repoId, cb) {
  this.userId = userId;
  this.repoId = repoId;

  var repoUri = this.userId + '/' + this.repoId;
  var repo = this.client.repo(repoUri);
  var user = this.client.user(this.userId);

  //TODO: Check request limit, pagination
  user.repos(function(err, status, body, headers) {
    if (err) {
      console.log('error loading repo');
    }

    this.getInfo(status, cb);
  }.bind(this));
};

/**
 * TODO: Use promises
 * Return the info of the repos 
 * @param  {Array}   repos - raw github repos
 * @param  {Function} cb    
 * @return {void}         
 */
Repo.prototype.getInfo = function(repos, cb) {
  if (!repos) {
    cb([]);
    return;
  }

  var db = new DB();

  this.user.me(function(err, data) {
    var userId = data.id;

    db.init().then(function() {
      var query = db.Repo.findAll({
        attributes: ['repo_id'],
        where: {
          user_id: userId
        }
      });

      query.then(function(subscribedTo) {
        var isSubscribed;

        subscribedTo = subscribedTo || [];
        subscribedTo = subscribedTo.map(function(r) {
          return r.dataValues.repo_id;
        });

        repos = repos.map(function(repo) {
          isSubscribed = _.includes(subscribedTo, repo.id);

          return {
            id: repo.id,
            name: repo.name,
            avatar_url: repo.avatar_url,
            description: repo.description,
            total_stars: repo.stargazers_count,
            new_stars: 0,
            language: repo.language,
            last_time_checked: new Date().getTime(),
            is_subscribed: isSubscribed
          };
        });

        cb(repos);
      });
    });
  });
};

Repo.prototype.subscribe = function(repoId) {
  return new Promise(function(resolve, reject) {
    repoId = parseInt(repoId);

    if (!repoId) {
      reject({message: "invalid repoId: " + repoId});
      return;
    }

    var db = new DB();

    this.user.me(function(err, data) {
      data = data || {};
      var userId = data.id;

      if (err || !userId) {
        reject(err);
        return;
      }      

      db.init().then(function() {
        db.Repo.create({
          userId: userId,
          repoId: repoId
        }).then(resolve).catch(reject);
      });
    });
  }.bind(this));
};

Repo.prototype.unsubscribe = function(repoId) {
  return new Promise(function(resolve, reject) {
    repoId = parseInt(repoId);

    if (!repoId) {
      reject({message: "invalid repoId: " + repoId});
      return;
    }

    var db = new DB();

    this.user.me(function(err, data) {
      data = data || {};
      var userId = data.id;

      if (err || !userId) {
        reject(err);
        return;
      }      

      db.init().then(function() {
        db.Repo.destroy({
          where: {
            userId: userId,
            repoId: repoId
          }
        }).then(resolve).catch(reject);
      });
    });
  }.bind(this));
};

module.exports = Repo;