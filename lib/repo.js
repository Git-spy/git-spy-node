var _ = require('lodash');
var github = require('octonode');
var DB = require('./db');
var User = require('./user');
var Promise = require('rsvp').Promise;

function Repo(accessToken) {
  this.accessToken = accessToken;
  this.client = github.client(this.accessToken);
  this.user = new User(this.accessToken);
  this.db = new DB();
};

/**
 * Docs...
 * @param  {String} id
 * @return {Promise}        
 */
Repo.prototype.findByUser = function(username) {
  this.username = username;

  return new Promise(function(resolve, reject) {
    var user = this.client.user(this.username);

    //TODO: Check request limit, pagination
    user.repos(function(err, status, body, headers) {
      if (err) {
        console.log('error loading repo');
      }

      this.getInfo(status, resolve);
    }.bind(this));
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

  var db = this.db;
  var self = this;

  this.user.me(function(err, data) {
    self.userId = data.id;

    db.init().then(function() {
      self.getSubscriptions().then(function() {
        repos = repos.map(function(repo) {
          return self.toJSON(repo);
        });

        cb(repos);
      });
    });
  });
};

Repo.prototype.getSubscriptions = function() {
  return new Promise(function(resolve, reject) {
    var query = this.db.Repo.findAll({
      attributes: ['repo_id'],
      where: {
        user_id: this.userId
      }
    });

    query.then(function(subscriptions) {
      subscriptions = subscriptions || [];
      subscriptions = subscriptions.map(function(r) {
        return r.dataValues.repo_id;
      });

      this.subscriptions = subscriptions;

      resolve(subscriptions);
    }.bind(this));
  }.bind(this));
};

/**
 * TODO: Only return new_stars if the user is subscribed
 * @param  {Object} repo 
 * @return {Promise}      
 */
Repo.prototype.toJSON = function(repo) {
  var isSubscribed = _.includes(this.subscriptions, repo.id);
  var currentStars = 0;
  var total = repo.stargazers_count;
  var newStars = total - currentStars;
  var lastTimeChecked = new Date().getTime();
  var json = _.pick(repo, ['id', 'name', 'avatar_url', 'description', 'language']);
  var showNew = false;

  if (showNew) {
    json.new_stars = newStars;
  }
  
  return _.merge(json, {
    total_stars: total,
    // last_time_checked: lastTimeChecked,
    is_subscribed: isSubscribed
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