
const copyFileFromSource = (storage, sourceFile, websiteId, destinationFile) => {
  return storage
    .bucket(process.env.GOOGLE_STORAGE_BUCKET)
    .file(`sources/${sourceFile}`)
    .copy(storage.bucket(process.env.GOOGLE_STORAGE_BUCKET).file(`${websiteId}/${destinationFile}`));
};

module.exports = copyFileFromSource;