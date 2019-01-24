const { getUrl } = require('../helpers');

const supported_apis = ['public'];
const supported_versions = ['v1'];

// configure the API for use
let config, url;
function init(opts) {
  let defaults = {
    public_key: null,
    private_key: null,
    endpoint: 'https://gateway.marvel.com',
    api: 'public',
    version: 'v1'
  };

  // validate our configuration object is sufficient
  let props = Object.assign({}, defaults, opts);
  let { public_key, private_key, endpoint, api, version } = props;

  if (!public_key || !private_key) {
    // public and private keys are required
    throw new Error('Cannot initialize Marvel API without your credentials being configured');
  }

  // validate and normalize options
  if (endpoint.charAt(endpoint.length) === '/') {
    props.endpoint = endpoint.substr(0, endpoint.length - 1);
  }

  // validate against supported apis
  api = api.toLowerCase();
  if (supported_apis.indexOf(api) === -1) {
    throw new Error(`Unsupported api provided [${api}]`);
  }
  props.api = api;

  // validate against supported versions
  version = version.toLowerCase();
  if (supported_versions.indexOf(version) === -1) {
    throw new Error(`Unsupported version provided [${version}]`);
  }
  props.version = version;
  config = props;
  url = getUrl.bind({}, config);
}

const Characters  = require('./characters');

const Marvel = {
  init,

  // delegate the characters endpoints
  get characters() {
    return Characters(url);
  }

  /*
  // delegate the creators endpoints
  get creators() {
    return Creators(url);
  }
  */
};

module.exports = Marvel;
