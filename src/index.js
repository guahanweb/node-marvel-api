const Marvel = require('./api');

const supported_apis = ['public'];
const supported_versions = ['v1'];

let instance;
function init(opts = {}) {
  let defaults = {
    public_key: null,
    private_key: null,
    endpoint: 'https://gateway.marvel.com',
    api: 'public',
    version: 'v1'
  };

  if (!instance) {
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

    console.info('[MARVEL] No existing instance, creating now...');
    instance = new Marvel(props);
  }
  return instance;
}

module.exports = {
  init
};
