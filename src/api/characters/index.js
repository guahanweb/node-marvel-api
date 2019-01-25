const Query = require('../query');
const { comics, creators, events, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /characters base API.
 * Inherits from the base Query object for execution and chaining.
 */
class CharacterQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    super('/characters', params);
  }

  // fetching a single record by id resets the params
  id(id) {
    let me = this;
    this.uri += `/${id}`;
    this.params = {};

    // add extended api functionality here
    this.comics = comics.bind(this);
    this.creators = creators.bind(this);
    this.events = events.bind(this);
    this.stories = stories.bind(this);

    return this;
  }
}

module.exports = function (params) {
  return new CharacterQuery(params);
};
