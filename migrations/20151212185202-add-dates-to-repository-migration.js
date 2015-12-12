'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'repository',
      'updatedAt', 
      {
        type: Sequelize.DATE
      }
    );
    queryInterface.addColumn(
      'repository',
      'createdAt', 
      {
        type: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {

  }
};
