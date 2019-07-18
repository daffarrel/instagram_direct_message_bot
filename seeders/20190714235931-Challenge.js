'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   return queryInterface.bulkInsert('Challenges', [
      {
        type: 'S',
        data: 'ActionSpamError',
        message: 'This action was disabled due to block from instagram!',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        type: 'F',
        data: 'RequestError',
        message: '',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        type: 'C',
        data: 'CheckpointError',
        message: 'Phone verification required',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        type: 'B',
        data: 'SentryBlockError',
        message: 'Sentry block from instagram',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        type: 'P',
        data: 'ParseError',
        message: 'Not possible to parse API response',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      },
      {
        type: 'T',
        data: 'TypeError',
        message: 'Cannot read property search key of null',
        state: '1',
        createdAt : new Date(),
        updatedAt : new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
