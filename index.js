// Get Development Env
require('./utilities/getEnv')();

const path = require('path');
const os = require('os');
const fs = require('fs');

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require('busboy');
const Firestore = require('@google-cloud/firestore');

const getToken = require('./utilities/getToken');
const getAuthorization = require('./services/getAuthorization');
const getFirestore = require('./db/getFirestore');
const addMediaToDb = require('./db/addMediaToDb');
const getStorage = require('./storage/getStorage');
const saveMediaToBucket = require('./storage/saveMediaToBucket');

let firestore;
let storage;

const saveMediaToDbStep = async (req, res, fields, file) => {
  try {
    const websiteId = req.query.websiteId;
    const directory = fields.directory;
    const filename = fields.filename;
    const size = req.fileSize;
    const url = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET}/${websiteId}/media/${directory}/${filename}`;
    // now() returns an object like this { "_seconds": 1559856428, "_nanoseconds": 858000000 }
    const mediaTimestamp = Firestore.Timestamp.now();
    firestore = getFirestore(firestore);
    await addMediaToDb(firestore, websiteId, filename, directory, url, size, mediaTimestamp);
    res.status(201);  // send CREATED
    res.send({
      url,
      size,
      createdAt: new Date(mediaTimestamp._seconds * 1000),
    });
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const saveMediaToBucketStep = async (req, res, fields, file) => {
  try {
    const websiteId = req.query.websiteId;
    storage = getStorage(storage);
    await saveMediaToBucket(storage, websiteId, fields.directory, fields.filename, file);
    await saveMediaToDbStep(req, res, fields, file);
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const busboyParseStep = async (req, res) => {
  const busboy = new Busboy({headers: req.headers});
  const tmpdir = os.tmpdir();
  // This object will accumulate all the fields, keyed by their name
  const fields = {};
  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};
  let fileSize = 0; // size in bytes
  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val) => {
    // TODO(developer): Process submitted field values here
    console.log(`Processed field ${fieldname}: ${val}.`);
    fields[fieldname] = val;
  });
  const fileWrites = [];
  // This code will process each file uploaded.
  busboy.on('file', (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);
    // File was processed by Busboy; wait for it to be written to disk.
    const promise = new Promise((resolve, reject) => {
      file.on('data', (chunk) => {
        fileSize += chunk.length;
      });
      file.on('end', () => {
        writeStream.end();
        console.log(`File size ${fileSize}`);
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on('finish', () => {
    Promise.all(fileWrites).then( async () => {
      try {
        req.fileSize = fileSize;
        await saveMediaToBucketStep(req, res, fields, /* file */ uploads.media);
      } catch (error) {
        console.error(error);
        res.status(401);
        res.end();  // send no content
      } finally {
        fs.unlinkSync(uploads.media);
      }
    });
  });

  busboy.end(req.rawBody);
};

const getAuthorizationStep = async (req, res) => {
  try {
    const userId = req.query.userId;
    const websiteId = req.query.websiteId;
    const token = req.userToken;
    const response = await getAuthorization(token, userId, websiteId);
    if (response.status===202) {
      // authorized
      await busboyParseStep(req, res);
    } else {
      // unauthorized
      console.log('the user ' + userId + ' is unauthorized');
      res.status(406);
      res.end();  // send no content
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getTokenStep = async (req, res) => {
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    res.status(401);
    res.end();  // send no content
  } else {
    // populate it
    req.userToken = myAuthentication.token;
    await getAuthorizationStep(req, res);
    // await busboyParseStep(req, res); /** IMPORTANT */
  }
};

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.postMedia = async (req, res) => {
  // const token = req.userToken;
  // const userId = req.query.userId;
  // const websiteId = req.query.websiteId;

  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204)
    res.end();
  } else {
    await getTokenStep(req, res);
  }
};