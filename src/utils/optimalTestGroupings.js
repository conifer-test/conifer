const minElem = (list) => {
  /*
  Returns the index of the minimum element of a list of integers
  */
  return list.indexOf(Math.min(...list));
};

// const timingData = async (testFileRuntimes, numParallelInstances) => {
//   /*
//   Given filesObj of format {fileName1: fileDuration1, fileName2: fileDuration2} and integer numParallelInstances representing the number of
//   parallel instances, returns lists of lists representing allocations of fileNames to each of the parallel instances (order doesn't matter)
//   */
//   const INDEX_OF_FILE_NAME = 0;
//   const INDEX_OF_DURATION = 1;

//   const fileAllocations = new Array(numParallelInstances).fill().map(Array);
//   const totals = new Array(numParallelInstances).fill(INDEX_OF_DURATION);

//   const filesList = Object.entries(testFileRuntimes).sort((a, b) => b[INDEX_OF_DURATION] - a[INDEX_OF_DURATION]);
//   for (const file of filesList) {
//     const currMinIndex = minElem(totals);
//     fileAllocations[currMinIndex].push(file[INDEX_OF_FILE_NAME]);
//     totals[currMinIndex] += file[INDEX_OF_FILE_NAME];
//   }

//   return fileAllocations;
// };

function allocateTests(testFileRuntimes, numParallelInstances) {
  const STARTING_DURATION = 0;
  const INDEX_OF_FILE_NAME = 0;
  const INDEX_OF_DURATION = 1;

  const fileAllocations = [];
  const totals = [];
  for (let i = 0; i < numParallelInstances; i++) {
    fileAllocations.push([]);
    totals.push(STARTING_DURATION);
  }

  let currMinIdx = 0;
  const filesLst = Object.entries(testFileRuntimes).sort(
    (a, b) => a[INDEX_OF_DURATION] - b[INDEX_OF_DURATION]
  );
  while (filesLst.length > 0) {
    const currFileEntry = filesLst.pop();
    fileAllocations[currMinIdx].push(currFileEntry[INDEX_OF_FILE_NAME]);
    totals[currMinIdx] += currFileEntry[INDEX_OF_DURATION];
    currMinIdx = minElem(totals);
  }
  // console.log(fileAllocations);
  return fileAllocations;
}

function allocateTestsFromObjects(objects, numNodes) {
  // Given list of objects with a given testRunID, returns the test alocations for
  const newObj = {};
  objects.forEach((obj) => (newObj[obj.testFileName] = obj.stats.duration));
  // console.log('newObj: ', newObj);
  return allocateTests(newObj, numNodes);
}

// const allocateTestsFromObjects = (testRunData, parallelInstances) => {
//   // Given list of objects with a given testRunID, returns the test alocations for
//   const testFileRuntimes = {};
//   testRunData.forEach((data) => (testFileRuntimes[data.testFileName] = data.stats.duration));
//   return timingData(testFileRuntimes, parallelInstances);
// };

module.exports = {
  allocateTestsFromObjects,
};
