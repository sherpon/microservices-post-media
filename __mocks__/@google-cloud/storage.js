/**
 * https://jestjs.io/docs/en/manual-mocks
 */

const { Storage } = jest.genMockFromModule('@google-cloud/storage');

class mockStorage extends Storage {
  constructor(opt) {
    super(opt);
  }

  bucket() {
    return {
      file: function () {
        return {
          copy: function () {
            return new Promise((resolve, reject) => {
              resolve(true);
            });
          }
        };
      },
    };
  }
};

exports.Storage = mockStorage;
