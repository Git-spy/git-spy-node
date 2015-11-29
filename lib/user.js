var _ = require('lodash');

/**
 * DOCS...
 * @type {[type]}
 */
var github = require('octonode');

function User(accessToken) {
  this.accessToken = accessToken;
  this.client = github.client(accessToken);
};

/**
 * DOCS...
 * @param  {Function} cb 
 * @return {void}      
 */
User.prototype.me = function(cb) {
  var me = this.client.me(this.accessToken);

  me.info(function(err, data) {
    data = _.pick(data, ['id', 'login', 'name', 'avatar_url', 'company', 'location', 'bio', 'public_repos', 'followers', 'following']);
    cb(err, data);
  });
};

/**
 * DOCS...
 * @param  {Function} cb 
 * @return {void}      
 */
User.prototype.limit = function(cb) {
  this.client.limit(cb);
};

module.exports = User;