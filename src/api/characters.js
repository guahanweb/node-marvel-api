const manager = require('./request-manager');

let url;

const Characters = {
  list: getCharacterList
};

function getCharacterList(params = {}) {
  const parameters = ['name', 'nameStartsWith', 'modifiedSince', 'comics', 'series', 'events', 'stories', 'orderBy', 'limit', 'offset'];
  const keys = Object.keys(params).filter(p => parameters.includes(p));
  let args = {};
  keys.forEach(k => {
    // @TODO: build validation around types
    args[k] = params[k];
  });

  return manager.fetch(url('/characters', args));
}

module.exports = function (getUrl) {
  url = getUrl;
  return Characters;
};
