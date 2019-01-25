const supported_apis = ['public'];
const supported_versions = ['v1'];

// configure the API for use
let config;
let apis = null;

function init(opts = null) {
  if (opts === null && apis !== null) {
    // we have already initialized, so return the apis
    return apis;
  }

  // default values to support future expansion
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

  // set up our APIs
  apis = {
    characters: require('./characters'),
    comics:     require('./comics'),
    creators:   require('./creators'),
    events:     require('./events'),
    series:     require('./series'),
    stories:    require('./stories')
  };

  return apis;
}

let Marvel = {
  init,
  get config() {
    return config;
  }
};

module.exports = Marvel;
