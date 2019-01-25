const { isNumeric } = require('../../helpers');

const Query = require('../query');
const { comics, creators, events, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /characters base API.
 * Inherits from the base Query object for execution and chaining.
 */
class CharacterQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    if (isNumeric(params)) {
      super('/characters');
      addExtras.call(this, params);
    } else {
      super('/characters', params);
    }
  }
}

function addExtras(id) {
  this.uri += `/${id}`;
  this.params = {};

  // add extended api functionality here
  this.comics = comics.bind(this);
  this.creators = creators.bind(this);
  this.events = events.bind(this);
  this.stories = stories.bind(this);
}

module.exports = function (params) {
  return new CharacterQuery(params);
};
