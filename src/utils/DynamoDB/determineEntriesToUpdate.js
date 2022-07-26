const getItemsByTestRunID = require('./getItemsByTestRunID');

const determineEntriesToUpdate = (function makeDetermineEntriesToUpdateFunc() {
  let currLatestTimeStamp = new Date('2000-07-20T03:43:35.505Z'); //arbitrarily old date from simpler times
  let prevLatestTimeStamp = currLatestTimeStamp;

  return async function determineEntriesToUpdate(testRunID) {
    /*
    input is testRunID, queries dynamoDB and returns array of test run objects
    that have not been updated since last poll.
    */
    const items = await getItemsByTestRunID(testRunID);
    const newItems = [];
    items.forEach((item) => {
      const itemDate = new Date(item.stats.end);
      if (prevLatestTimeStamp < itemDate) {
        newItems.push(item);
        if (currLatestTimeStamp < itemDate) {
          currLatestTimeStamp = itemDate;
        }
      }
    });
    prevLatestTimeStamp = currLatestTimeStamp;
    return newItems;
  };
})();

module.exports = determineEntriesToUpdate;
