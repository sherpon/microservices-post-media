const Firestore = require('@google-cloud/firestore');

/**
 * @returns {Object} - returns the mysql connection object
 */
const getConnection = (firestore) => {
  if (!firestore) {
    if (process.env.SHERPON_ENV==='DEVELOPMENT') {
      firestore = new Firestore({
        projectId: process.env.GOOGLE_PROJECT_ID,
        keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT,
      });
    } else {
      firestore = new Firestore();
    }
  }

  return firestore;
};

module.exports = getConnection;