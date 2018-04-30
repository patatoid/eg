const { spawn } = require('child_process');

module.exports=class Helper {
  static async sleep(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(seconds), seconds*1000);
    });
  }

  static launchProcess(process) {
    return spawn(...process);
  }
}

