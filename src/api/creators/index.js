const Query = require('../query');
const { comics, events, series, stories } = require('../add-ons');

/**
 * Build out and manage all paths for the /creators base API.
 * Inherits from the base Query object for execution and chaining.
 */
class CreatorQuery extends Query {
  // @TODO: filter params and validate them for this endpoint
  constructor(params) {
    super('/creators', params);
  }

  // fetching a single record by id resets the params
  id(id) {
    let me = this;
    this.uri += `/${id}`;
    this.params = {};

    // add functions here
    this.comics = comics.bind(this);
    this.events = events.bind(this);
    this.series = series.bind(this);
    this.stories = stories.bind(this);

    return this;
  }
}

module.exports = function (params) {
  return new CreatorQuery(params);
};
