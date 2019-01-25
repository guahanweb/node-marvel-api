const Query = require('../query');
const { characters, creators, events, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /comics base API.
 * Inherits from the base Query object for execution and chaining.
 */
class ComicQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    super('/comics', params);
  }

  // fetching a single record by id resets the params
  id(id) {
    let me = this;
    this.uri += `/${id}`;
    this.params = {};

    // add functions here
    this.characters = characters.bind(this);
    this.creators = creators.bind(this);
    this.events = events.bind(this);
    this.stories = stories.bind(this);

    return this;
  }
}

module.exports = function (params) {
  return new ComicQuery(params);
};

