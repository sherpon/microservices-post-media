
const addMediaToDb = async (
  firestore, 
  websiteId, 
  filename, 
  directory, 
  url, 
  size, 
  mediaTimestamp
) => {
  const websiteRef = firestore.collection('websites').doc(websiteId);
  return websiteRef.collection('media').doc(filename).set({
    directory, 
    url, 
    size,
    createdAt: mediaTimestamp,
  });
};

module.exports = addMediaToDb;