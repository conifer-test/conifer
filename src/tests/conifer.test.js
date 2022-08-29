/* eslint-disable no-undef */

// Require file allocation function
const { allocateTests } = require('../utils/optimalTestGroupings');

describe('Test file allocation algorithm', () => {
  test.only('Return correct test allocations', () => {
    const expectedResult = [['test5.cy.js'], ['test1.cy.js', 'test2.cy.js'],['test4.cy.js', 'test6.cy.js', 'test3.cy.js']];
    const input = { 
      'test1.cy.js': 5, 
      'test2.cy.js': 2, 
      'test3.cy.js': 1, 
      'test4.cy.js': 3,
      'test5.cy.js': 10,
      'test6.cy.js': 2
    };

    const numberOfParallelInstances = 3;

    expect(expectedResult).toEqual(allocateTests(input, numberOfParallelInstances));
  });
});