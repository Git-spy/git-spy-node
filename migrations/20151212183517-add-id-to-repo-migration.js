'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'repository',
      'id', 
      {
        type: Sequelize.INTEGER,
        autoIncrement: true
      }
    );
  },

  down: function(queryInterface, Sequelize) {

  }
};