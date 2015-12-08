'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('repository', {
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id'
      },
      repoId: {
        type: Sequelize.INTEGER,
        field: 'repo_id'
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    // return queryInterface.dropTable('repository');
  }
};