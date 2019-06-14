const axios = require('axios');

/**
 * @param {string} token
 * @param {string} userId
 * @param {number} websiteId
 */
const getAuthorization = (token, userId, websiteId) => {
  return axios({
    method: 'post',
    baseURL: `${process.env.MICROSERVICES_ENDPOINT}/getAuthorization`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      userId: userId,
      websiteId: websiteId,
    }
  });
};

module.exports = getAuthorization;