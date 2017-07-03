class ErrorWithKey extends Error {
  constructor(message, key) {
    super(message);
    if (new.target === ErrorWithKey) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    this.message = message;
    this.key = key;
  }
}

class UnsupportedFormatError extends ErrorWithKey {
  constructor(message, key, contentType) {
    super(message, key);
    this.name = 'UnsupportedFormatError';
    this.contentType = contentType;
  }
}

class DecodingError extends ErrorWithKey {
  constructor(message, key) {
    super(message, key);
    this.name = 'DecodingError';
  }
}

//use for handling errors related to requests.
//** may result in "control flow via error/exception"...
class RequestError extends ErrorWithKey {
  constructor(message, key, res = {}) {
    super(message, key);
    this.statusCode = res.statusCode;
    this.statusMessage = res.statusMessage;
    this.name = 'RequestError';
  }
}

//use for cases that aren't exactly easy to track down.
class UnknownError extends ErrorWithKey {
  constructor(message, key) {
    super(message, key);
    this.name = 'UnknownError';
  }
}

module.exports = {
  UnknownError, RequestError, UnsupportedFormatError, DecodingError
}
