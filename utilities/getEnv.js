/**
 * Get the environment variables. 
 * 
 * See this issue to understand why use this function
 * https://github.com/googlearchive/cloud-functions-emulator/issues/178
 */
const getEnv = () => {

  if (process.env.SHERPON_ENV===undefined) {
    const DEVELOPMENT_ENV =  require('../env/.env.development.json');
    
    // copy the env variables
    process.env = Object.assign({}, process.env, DEVELOPMENT_ENV);
  }
}

module.exports = getEnv;