var Sequelize = require('sequelize');
var env = require('./env');
var sequelize = new Sequelize(env.databaseUrl, {
  _logging: false
});

function DB() {

};

DB.prototype.init = function() {
  //TODO: move definition of models to different files
  this.Repo = sequelize.define('Repository', {
    userId: {
      type: Sequelize.INTEGER,
      field: 'user_id'
    },
    repoId: {
      type: Sequelize.INTEGER,
      field: 'repo_id'
    }
  }, {
    tableName: 'repository'
  });

  return sequelize.sync();
};

module.exports = DB;