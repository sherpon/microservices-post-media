const { Storage } = require('@google-cloud/storage');

const getStorage = (storage) => {
  if (!storage) {
    if (process.env.SHERPON_ENV==='DEVELOPMENT') {
      storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID,
        keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT,
      });
    } else {
      storage = new Storage();
    }
  }

  return storage;
};

module.exports = getStorage;