const Query = require('../query');
const { characters, comics, creators, events, series } = require('../add-ons');

/**
 * Build out and manage all paths for the /stories base API.
 * Inherits from the base Query object for execution and chaining.
 */
class StoryQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    super('/stories', params);
  }

  // fetching a single record by id resets the params
  id(id) {
    let me = this;
    this.uri += `/${id}`;
    this.params = {};

    // add functions here
    this.characters = characters.bind(this);
    this.comics = comics.bind(this);
    this.creators = creators.bind(this);
    this.events = events.bind(this);
    this.series = series.bind(this);

    return this;
  }
}

module.exports = function (params) {
  return new StoryQuery(params);
};
