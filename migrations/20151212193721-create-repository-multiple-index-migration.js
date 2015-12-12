'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addIndex(
      'repository', ['user_id', 'repo_id'], {
        indexName: 'UserIdRepoId',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: function(queryInterface, Sequelize) {}
};