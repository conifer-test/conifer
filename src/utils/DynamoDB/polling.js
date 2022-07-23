const getItemsByTestRunID = require('./getItemsByTestRunID');

let currLatestTimeStamp = new Date('2010-07-20T03:43:35.505Z'); //arbitrarily old date
let prevLatestTimeStamp = currLatestTimeStamp;

function updateDashboard(newItems) {
  console.log('new items are: ', newItems);
  console.log('dashboard updated!');
}

async function itemsToUpdate (testRunID) {
  const items = await getItemsByTestRunID(testRunID);
  const newItems = [];
  items.forEach(item => {
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
}

async function pollForData (testRunID) {
  const empty = 0;
  const pollingTimePeriod = 3000; //arbitrary 30 second polling time period for testing
  const pollingInterval = 1000; //ms
  let stillPolling = true;
  setTimeout(() => {
    console.log('still polling now false');
    stillPolling = false;
    while (stillPolling) {
      setTimeout(async () => {
        const newItems = await itemsToUpdate(testRunID);
        if (newItems.length !== empty) {
          updateDashboard(newItems);
          console.log('hi');
        } else {
          console.log('no new items to update');
        }
      }, pollingInterval);
    }
  }, pollingTimePeriod);
}

pollForData('A');

module.exports = pollForData;