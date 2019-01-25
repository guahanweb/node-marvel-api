const request = require('request-promise');

const { config } = require('./index');
const { getUrl, cleanUrl } = require('../helpers');

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

  // we are going to juggle data just a bit for easier access
  put(key, data) {
    let index = this.keys.length;
    this.keys[index] = key;
    this.etags[index] = data.etag || null;
    this.cache[index] = data;
  }

  // retrieve the etag, if it exists, for the cache key
  etag(key) {
    let index = this.keys.indexOf(key);
    return (index === -1) ? null : this.etags[index];
  }

  // retrieve the cached data, if it exists, for the cache key
  get(key) {
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
// initialize one static instance across all requests we need to manage
const cache = new RequestCache();

/**
 * Requests to the API need to cache the last response
 * with the ETag and attach the ETag header to subsequent
 * requests.
 */
const RequestManager = {
  /**
   * Request a data set from the provided API path. This method will attempt
   * to pass any existing ETag from previously matching cache keys, and if we
   * receive a 304 Unchanged, it will resolve with the previously cached
   * version.
   *
   * @param {string} url The API path we are calling
   * @returns {Promise}
   */
  async fetch(url, params) {
    // set up  our cache key and full auth URI for this request
    let key = JSON.stringify({ url, params });
    let uri = getUrl(config, url, params);

    let opts = {
      method: 'GET',
      uri,
      headers: {
        'accept': '*/*'
      },
      // we will use the transform method as an easy way to cache the response, since
      // only 2xx responses fire this method
      transform: function (body, response, resolveWithFullResponse) {
        let data = JSON.parse(body);
        cache.put(key, data);
        return data;
      }
    };

    // if we have a cache for this route, hand the ETag header off
    // to the API.
    let etag = cache.etag(key);
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
            let payload = cache.get(key);
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
  },

  // accessor to retrieve the full cache payload for persistence, if desired
  get cache() {
    return cache.toJSON();
  },

  // pre-saturate the cache with a previously known state
  set cache(data) {
    cache.fromJSON(data);
  }
}

module.exports = RequestManager;
