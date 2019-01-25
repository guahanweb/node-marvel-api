const crypto = require('crypto');
const url = require('url');
const qs = require('querystring');

function getAuth(public_key, private_key) {
  let ts = +(new Date);
  let apikey = public_key;
  let hash = crypto.createHash('md5')
    .update(ts + private_key + public_key)
    .digest('hex');

  return { ts, apikey, hash };
}

function getUrl(opts, path, params = {}) {
  let { public_key, private_key, endpoint, version, api } = opts;
  let auth = getAuth(public_key, private_key);
  let query = qs.stringify({
    ...params,
    ...auth
  });

  path = (path.charAt(0) === '/') ? path.substr(1) : path;
  return `${endpoint}/${version}/${api}/${path}?${query}`;
}

function cleanUrl(uri) {
  let urlObj = url.parse(uri);
  let query = qs.parse(urlObj.search);

  delete query.ts;
  delete query.apikey;
  delete query.hash;

  urlObj.search = qs.stringify(query);
  return urlObj.toString();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = {
  getAuth,
  getUrl,
  cleanUrl,
  isNumeric
};
