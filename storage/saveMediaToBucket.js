/**
 * reference: https://cloud.google.com/nodejs/docs/reference/storage/2.5.x/File#save
 */

const saveMediaToBucket = async (storage, websiteId, directory, filename, file) => {
  const options = {
    destination: `${websiteId}/media/${directory}/${filename}`,
    resumable: false,
  };
  await storage.bucket(process.env.GOOGLE_STORAGE_BUCKET).upload(file, options);
  await storage.bucket(process.env.GOOGLE_STORAGE_BUCKET).file(options.destination).makePublic();
};

module.exports = saveMediaToBucket;