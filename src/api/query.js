const Result = require('./result');
const manager = require('./request-manager');

/**
 * High level query object to help manage the subtleties of the
 * various requests, including pagination or request chaining.
 */
class Query {
  constructor(uri, params = {}) {
    this.uri = uri;
    this.params = params;
    this.result = null;
  }

  // this method is what actually signals the query to execute and
  // returns the promise object to be resolved
  execute() {
    return manager.fetch(this.uri, this.params)
      .then(result => {
        this.last = new Result(result);
        return this.last;
      });
  }

  // if there are remaining results, based on the metadata returned,
  // bump the offset by current limit and return the query object
  get next() {
    if (this.last !== null) {
      try {
        let { data } = this.last;
        let { offset, limit, total, count } = data;
        if (offset + count < total) {
          this.params.offset = offset + limit;
          return this;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

module.exports = Query;
