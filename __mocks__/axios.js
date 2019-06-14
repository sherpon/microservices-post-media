/**
 * https://jestjs.io/docs/en/manual-mocks
 */

let axios = jest.genMockFromModule('axios');

let __mockResponse = {};
const __setMockResponse = (newMockResponse) => {
  __mockResponse = newMockResponse;
};

axios = (options) => {
  return new Promise((resolve, reject) => {
    resolve(__mockResponse);
  });
};

axios.__setMockResponse = __setMockResponse;
module.exports = axios;