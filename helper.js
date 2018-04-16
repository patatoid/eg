module.exports=class Helper {
  static async delay(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(seconds), seconds*1000);
    });
  }
}

const process= url => ['open', ['-a', '/Applications/Chromium.app', `${url}`]];
const openURL = url => execa(...process(url));
