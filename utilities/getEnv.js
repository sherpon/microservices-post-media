const fs = require('fs');

/**
 * Get the environment variables. 
 * 
 * See this issue to understand why use this function
 * https://github.com/googlearchive/cloud-functions-emulator/issues/178
 */
const getEnv = () => {

  if (process.env.SHERPON_ENV===undefined) {
    let DEVELOPMENT_ENV = fs.readFileSync('../env/development.env.json', { encoding: 'utf8' });
    DEVELOPMENT_ENV = JSON.parse(DEVELOPMENT_ENV);
    // const DEVELOPMENT_ENV =  require('../env/development.env.json');
    
    // copy the env variables
    process.env = Object.assign({}, process.env, DEVELOPMENT_ENV);
  }
}

module.exports = getEnv;