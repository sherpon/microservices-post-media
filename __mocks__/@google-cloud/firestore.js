/**
 * https://jestjs.io/docs/en/manual-mocks
 */

let Firestore = jest.genMockFromModule('@google-cloud/firestore');

let __mockObjectRef = {
  id: '',
};
const __setMockObjectRef = (newObjectRef) => {
  __mockObjectRef = newObjectRef;
};

const reference = {
  collection: function () {
    return {
      add: function () {
        return new Promise((resolve, reject) => {
          resolve(__mockObjectRef);
        });
      },
    };
  },
};

class mockFirestore extends Firestore {
  constructor(opt) {
    super(opt);
  }

  collection() {
    return {
      doc: function () {
        return reference;
      },
      add: function () {
        return new Promise((resolve, reject) => {
          resolve(__mockObjectRef);
        });
      },
    };
  }
}

mockFirestore.__setMockObjectRef = __setMockObjectRef;
mockFirestore.Timestamp = {
  now: function () {
    return { 
      _seconds: 1559856428, 
      _nanoseconds: 858000000 
    };
  }
};
module.exports = mockFirestore;