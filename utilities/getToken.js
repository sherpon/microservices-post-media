
/**
 * Get the token from the header of the request.
 * 
 * @param {Object} headers - req.header. Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @returns {Boolean|Object} - If doesn't find authentication returns false. 
 *                     Otherwise, return a Object with the token
 */
function getToken(headers) {
  if (!headers || !headers.authorization) {
    // 'No authorization token found.
    return false;
  }
  // expect authorization header to be
  // Bearer xxx-token-xxx
  const parts = headers.authorization.split(' ');
  if (parts.length != 2) {
    // Bad credential format.
    return false;
  }
  const scheme = parts[0];
  const token = parts[1];

  return { scheme, token };
}

module.exports = getToken;