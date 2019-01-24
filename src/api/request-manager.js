const request = require('request-promise');
const { cleanUrl } = require('../helpers');

/**
 * Lightweight request cache.
 * At this point, there is nothing fancy about it, but there are some
 * ideas and optimizations to be built out.
 *
 * @class
 */
class RequestCache {
  constructor() {
    this.keys = [];
    this.etags = [];
    this.cache = [];
  }

  put(key, data) {
    let index = this.keys.length;
    this.keys[index] = key;
    this.etags[index] = data.etag || null;
    this.cache[index] = data;
  }

  etag(key) {
    let index = this.keys.indexOf(key);
    return (index === -1) ? null : this.etags[index];
  }

  get() {
    let index = this.keys.indexOf(key);
    return (index === -1) ? null : this.cache[index];
  }

  /**
   * Allows for saturating the cache from some external storage. Since we don't
   * know whether this module will be run as a script or within a service, we need
   * to allow for external persistence of the cache.
   *
   * @param {object} o A valid cache object
   * @returns void
   */
  fromJSON(o) {
    this.cache = [];
    Object.keys(o).forEach((key, index) => {
      let { etag, data } = o[key];
      if (!!etag && typeof data === 'object') {
        this.keys[index] = key;
        this.etags[index] = etag;
        this.cache[index] = data;
      }
    });
  }

  /**
   * Exports a JSON representation of the current cache. This allows applications
   * and scripts to persist the cache as they see fit.
   *
   * @returns {object}
   */
  toJSON() {
    let o = {};
    for (let i = 0; i < this.keys.length; i++) {
      let key = this.keys[i];
      let etag = this.etags[i];
      let data = this.cache[i];
      o[key] = { etag, data };
    }
    return o;
  }
}

/**
 * Requests to the API need to cache the last response
 * with the ETag and attach the ETag header to subsequent
 * requests.
 *
 * @class
 */
class RequestManager {
  constructor() {
    this.cache = new RequestCache();
  }

  /**
   * Request a data set from the provided API path. This method will attempt
   * to pass any existing ETag from previously matching cache keys, and if we
   * receive a 304 Unchanged, it will resolve with the previously cached
   * version.
   *
   * @param {string} url The API path we are calling
   * @returns {Promise}
   */
  async fetch(url) {
    let me = this;
    let key = cleanUrl(url);
    let opts = {
      method: 'GET',
      uri: url,
      headers: {
        'accept': '*/*'
      },
      // we will use the transform method as an easy way to cache the response, since
      // only 2xx responses fire this method
      transform: function (body, response, resolveWithFullResponse) {
        let data = JSON.parse(body);
        me.cache.put(key, data);
        return data;
      }
    };

    // if we have a cache for this route, hand the ETag header off
    // to the API.
    let etag = this.cache.etag(key);
    if (!!etag) {
      opts.headers['if-none-match'] = etag;
    }

    // return a promise for the actual fetch execution
    return new Promise((resolve, reject) => {
      // We don't want to just return the request promise, since a 304 fires a rejection
      // by default. We want to handle that rejection case and resolve our fetch but pass
      // through other failure cases.
      request(opts)
        .then(resolve)
        .catch(err => {
          // 304 tells us we had an ETag match
          if (err.response.statusCode === 304) {
            let payload = me.cache.get(key);
            if (!payload) {
              // we expected a hit here, but something failed, so we reject anyway
              reject(err);
            } else {
              // we have both an ETag and cache hit, so we want to resolve the last
              // known good response.
              resolve(payload);
            }
          } else {
            // non 304
            reject(err);
          }
        });
    });
  }
}

const rm = new RequestManager();
module.exports = rm;
