const { exec } = require('child_process');

module.exports = async () => {
  const dashboard = exec('start_dashboard'); // start backend express and frontend react
  dashboard.stdout.on('data', (data) => {
    console.log(`${data}`);
    (async () => await open('http://localhost:7777'))(); // TODO: Port number we want?
  });
};
