const getToken = require('./getToken');

describe('Test getEnv', () => {

  test('It should get the token', () => {
    const headers = {
      "authorization": "Beare zxcvbnmasdfghjklqwertyuiop"
    };
    const result = getToken(headers);
    expect(result.token).toMatch(/zxcvbnmasdfghjklqwertyuiop/);
  });

  test('It should show the error that there isn\'t the authorization headers', () => {
    const headers = {};
    const result = getToken(headers);
    expect(result).toBe(false);
  });

  test('It should show the error that there isn\'t the token in the authorization headers', () => {
    const headers = {
      "authorization": "Beare"
    };
    const result = getToken(headers);
    expect(result).toBe(false);
  });

  test('It should show the error that there is a wrong token in the authorization headers', () => {
    const headers = {
      "authorization": "Beare 1qazxsw2 3edcvfr4"
    };
    const result = getToken(headers);
    expect(result).toBe(false);
  });
});