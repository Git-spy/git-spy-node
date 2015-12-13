'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'repository',
      'stars', 
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    
  }
};
