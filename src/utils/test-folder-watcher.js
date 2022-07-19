const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;

class Observer extends EventEmitter {
  constructor() {
    super();
  }
  watchFolder(folder) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
      );
      var watcher = chokidar.watch(folder, { persistent: true });
      watcher.on('add', async filePath => {
        if (filePath.includes('.json')) {
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been added.`
          );

          // emit an event when new file has been added
          this.emit('file-added', {
            filePath
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Observer;